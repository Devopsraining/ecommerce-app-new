# PostgreSQL Database Setup Guide

## Database Schema Summary

Your application uses 3 tables:

1. **products** - Stores product catalog
   - id (SERIAL PRIMARY KEY)
   - name (VARCHAR)
   - price (DECIMAL)
   - description (TEXT)
   - created_at (TIMESTAMP)

2. **orders** - Stores customer orders
   - id (SERIAL PRIMARY KEY)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

3. **order_items** - Junction table for order line items
   - id (SERIAL PRIMARY KEY)
   - order_id (FK → orders.id)
   - product_id (FK → products.id)
   - quantity (INTEGER)
   - price (DECIMAL)
   - created_at (TIMESTAMP)

## Terraform Setup

### 1. Create Terraform Configuration for Cloud SQL (GCP)

Create `terraform/main.tf`:

```hcl
# Enable required APIs
resource "google_project_service" "sqladmin" {
  project = var.project_id
  service = "sqladmin.googleapis.com"
  disable_on_destroy = false
}

# Create PostgreSQL instance
resource "google_sql_database_instance" "postgres" {
  name             = "ecommerce-db-${var.environment}"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier              = "db-f1-micro"  # Change to larger tier for production
    availability_type = "REGIONAL"
    
    backup_configuration {
      enabled = true
      point_in_time_recovery_enabled = true
    }

    ip_configuration {
      require_ssl       = true
      ipv4_enabled      = true
      publicly_accessible = false
      
      # Allow connections from your app/VPC
      authorized_networks {
        name  = "allow-app"
        value = var.app_ip_range  # Your app's IP range
      }
    }

    database_flags {
      name  = "max_connections"
      value = "100"
    }
  }

  deletion_protection = false
}

# Create database
resource "google_sql_database" "ecommerce" {
  name     = "ecommerce_db"
  instance = google_sql_database_instance.postgres.name
  charset  = "UTF8"
}

# Create database user
resource "random_password" "db_password" {
  length  = 24
  special = true
}

resource "google_sql_user" "app_user" {
  name     = "ecommerce_user"
  instance = google_sql_database_instance.postgres.name
  password = random_password.db_password.result
}

# Initialize database with schema
resource "google_sql_database_instance_sql_init" "init" {
  instance = google_sql_database_instance.postgres.name
  sql_script = file("${path.module}/../backend/init.sql")
  depends_on = [
    google_sql_database.ecommerce,
    google_sql_user.app_user
  ]
}

# Output connection string for backend
output "db_connection_string" {
  value     = "postgresql://${google_sql_user.app_user.name}:${random_password.db_password.result}@${google_sql_database_instance.postgres.private_ip_address}:5432/${google_sql_database.ecommerce.name}"
  sensitive = true
}

output "db_host" {
  value = google_sql_database_instance.postgres.private_ip_address
}
```

### 2. Create Terraform Variables

Create `terraform/variables.tf`:

```hcl
variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "app_ip_range" {
  description = "CIDR range of your application"
  type        = string
}
```

### 3. Deploy with Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -var="project_id=your-project" \
               -var="app_ip_range=10.0.0.0/8"

# Apply changes
terraform apply -var="project_id=your-project" \
                -var="app_ip_range=10.0.0.0/8"

# Get connection details
terraform output db_connection_string
terraform output db_host
```

## Backend Configuration Steps

### 1. Copy environment file:
```bash
cd backend
cp .env.example .env
```

### 2. Update `.env` with Terraform outputs:
```
DATABASE_URL=postgresql://ecommerce_user:password@<db_host>:5432/ecommerce_db
NODE_ENV=production
PORT=5000
```

### 3. Start backend:
```bash
npm install
npm start
```

## Database Initialization

The `init.sql` script in your backend directory will:
- Create the 3 required tables
- Set up foreign key relationships
- Insert 3 sample products

The script uses `CREATE TABLE IF NOT EXISTS` to be idempotent.

## Connection Testing

Test the connection from your backend:
```bash
# Health check endpoint will verify DB connectivity
curl http://localhost:5000/api/health
```

Response should be:
```json
{
  "status": "ok",
  "database": "connected"
}
```
