# Salmon Allocation System

A web-based dashboard for managing salmon order allocation

## Live Demo

🔗 https://allocation-oms.vercel.app/

## Features

- Automatic order allocation based on business priority rules
- Allocation preview before confirmation
- Manual allocation adjustment
- Inventory validation
- Customer credit validation
- Order search and filtering
- Inventory management dashboard
- Customer credit overview

## Allocation Rules

1. Priority Order:
   Emergency > Overdue > Daily

2. If priorities are equal:
   FIFO (First In, First Out)

3. Customer credit validation is required.

4. If Warehouse ID and Supplier ID are "000",
   inventory with the highest available stock will be selected.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Faker.js (Mock Data)
- Vercel

## Future Improvements

### UI and System Enhancements

- Implement Authentication and Authorization for secure access to internal business data.
- Add Analytics Dashboard with charts and visual reports for allocation, inventory, and customer insights.
- Support data export to Excel, CSV, and PDF formats.
- Enhance search and filtering capabilities for large datasets.
- Implement allocation history tracking and audit logs.
- Introduce Master Data Management for products, warehouses, suppliers, customers, and pricing configuration.

### Technical Improvements

- Replace mock data with backend APIs and database integration.
- Adopt Redux Toolkit or a similar state management solution as the application grows.
- Implement automated testing to improve reliability and maintainability.
