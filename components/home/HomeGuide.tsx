"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Lang = "th" | "en";

export function HomeGuide() {
  const [lang, setLang] = useState<Lang>("en");

  return (
    <main className="p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Welcome</h1>
            <p className="text-muted-foreground">
              Salmon Allocation System
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-md border p-1">
            <button
              type="button"
              onClick={() => setLang("th")}
              className={`inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm ${
                lang === "th" ? "bg-foreground text-background" : ""
              }`}
            >
              <Image
                src="/images/flags/th.svg"
                alt="TH"
                width={24}
                height={16}
                className="rounded-sm border"
              />
              TH
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm ${
                lang === "en" ? "bg-foreground text-background" : ""
              }`}
            >
              <Image
                src="/images/flags/gb.svg"
                alt="EN"
                width={24}
                height={16}
                className="rounded-sm border"
              />
              EN
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto rounded-md border bg-background p-5">
          {lang === "th" ? (
            <div className="space-y-4 text-sm leading-7">
              <h2 className="text-2xl font-bold">คู่มือการใช้งาน</h2>

              <h3 className="text-xl font-semibold">1. Dashboard</h3>
              <p>
                เมนู Dashboard ใช้สำหรับแสดงรายการคำสั่งซื้อปลาแซลมอน (Salmon Orders)
                ที่ได้รับจากลูกค้า พร้อมระบบจัดสรรสินค้าอัตโนมัติ
              </p>

              <h4 className="text-lg font-semibold">
                1.1 ระบบจัดสรรอัตโนมัติ (Auto Allocation)
              </h4>
              <p>
                เมื่อเข้าสู่หน้า Dashboard ระบบจะทำการจัดสรรสินค้าอัตโนมัติโดยทันที
                และแสดงผลลัพธ์ในหน้าต่าง Preview ก่อนยืนยันการจัดสรร
              </p>

              <h4 className="text-lg font-semibold">1.2 หลักการจัดสรรสินค้า</h4>
              <p>
                ระบบจะจัดสรรสินค้าตามลำดับความสำคัญของคำสั่งซื้อดังนี้
              </p>
              <ul className="list-disc pl-5">
                <li>Emergency</li>
                <li>Overdue</li>
                <li>Daily</li>
              </ul>
              <p>
                หากคำสั่งซื้อมีระดับความสำคัญเท่ากัน ระบบจะใช้หลักการ FIFO
                (First In, First Out)
                โดยให้สิทธิ์กับคำสั่งซื้อที่เข้ามาก่อน
              </p>
              <p>
                นอกจากนี้ ระบบยังตรวจสอบวงเงินเครดิตคงเหลือ (Available Credit)
                ของลูกค้า เพื่อป้องกันการจัดสรรเกินวงเงินที่สามารถใช้งานได้
              </p>

              <h5 className="font-semibold">
                1.2.1 ราคาและประเภทคำสั่งซื้อ
              </h5>
              <p>
                ระดับความสำคัญของคำสั่งซื้อแต่ละประเภทมีผลต่อราคาสินค้าต่อหน่วย
                ที่ใช้ในการคำนวณการจัดสรร
              </p>

              <h4 className="text-lg font-semibold">1.3 การเลือกสินค้าจากคลัง</h4>
              <p>
                ระบบจะค้นหาสินค้าจาก Inventory โดยอ้างอิงจากรหัส Warehouse และ
                Supplier ที่ระบุในคำสั่งซื้อ
              </p>
              <p>
                กรณีที่รหัส Warehouse และ Supplier เป็น <code>000</code>
                ระบบจะเลือกสินค้าจาก Stock ที่มียอดคงเหลือสูงที่สุดโดยอัตโนมัติ
              </p>

              <h4 className="text-lg font-semibold">1.4 การแก้ไขผลการจัดสรร</h4>
              <p>ผู้ใช้งานสามารถแก้ไขข้อมูลการจัดสรรได้ 2 วิธี</p>
              <ul className="list-disc pl-5">
                <li>แก้ไขผ่านหน้าต่าง Preview ของ Auto Allocation</li>
                <li>แก้ไขผ่านตารางคำสั่งซื้อ (Orders Table) โดยตรง</li>
              </ul>

              <h4 className="text-lg font-semibold">1.5 การค้นหาข้อมูล</h4>
              <p>ระบบรองรับการค้นหาคำสั่งซื้อจากข้อมูลต่อไปนี้</p>
              <ul className="list-disc pl-5">
                <li>รหัสคำสั่งซื้อ (Order ID)</li>
                <li>รหัสคำสั่งซื้อย่อย (Sub Order ID)</li>
                <li>รหัสลูกค้า (Customer ID)</li>
                <li>ช่วงวันที่ที่กำหนด</li>
              </ul>

              <hr className="my-2" />

              <h3 className="text-xl font-semibold">2. Inventory</h3>
              <p>
                เมนู Inventory ใช้สำหรับตรวจสอบปริมาณสินค้าคงเหลือในแต่ละ
                Warehouse
              </p>
              <p>
                <strong>หมายเหตุ:</strong> ในเวอร์ชันปัจจุบัน ข้อมูล Inventory
                เป็นข้อมูลจำลอง (Mock Data) และจะไม่ถูกอัปเดตอัตโนมัติหลังจากมีการจัดสรรสินค้า
              </p>

              <hr className="my-2" />

              <h3 className="text-xl font-semibold">3. Customer</h3>
              <p>
                เมนู Customer ใช้สำหรับตรวจสอบข้อมูลเครดิตของลูกค้า ได้แก่
              </p>
              <ul className="list-disc pl-5">
                <li>Credit Limit</li>
                <li>Used Credit</li>
                <li>Available Credit</li>
              </ul>
              <p>
                <strong>หมายเหตุ:</strong> ในเวอร์ชันปัจจุบัน ข้อมูล Customer
                เป็นข้อมูลจำลอง (Mock Data) และจะไม่ถูกอัปเดตอัตโนมัติหลังจากมีการจัดสรรสินค้า
              </p>

              <hr className="my-2" />

              <h2 className="text-2xl font-bold">
                แนวทางการพัฒนาระบบในอนาคต
              </h2>

              <h3 className="text-xl font-semibold">
                การพัฒนาด้าน UI และความสมบูรณ์ของระบบ
              </h3>

              <h4 className="text-lg font-semibold">
                1. ระบบยืนยันตัวตนและกำหนดสิทธิ์การใช้งาน
                (Authentication & Authorization)
              </h4>
              <p>
                เพิ่มระบบเข้าสู่ระบบและกำหนดสิทธิ์การเข้าถึง เพื่อเพิ่มความปลอดภัยของข้อมูล
                เนื่องจากระบบนี้ถูกออกแบบมาเพื่อใช้งานภายในองค์กร
                และมีข้อมูลสำคัญเกี่ยวกับลูกค้า สินค้าคงคลัง และการจัดสรรสินค้า
              </p>

              <h4 className="text-lg font-semibold">
                2. Dashboard สำหรับการวิเคราะห์ข้อมูล
              </h4>
              <p>
                เพิ่มการแสดงผลข้อมูลในรูปแบบกราฟและแผนภูมิ
                (Charts & Analytics Dashboard) เพื่อช่วยให้ผู้ใช้งานสามารถวิเคราะห์ข้อมูลได้ง่ายขึ้น เช่น
              </p>
              <ul className="list-disc pl-5">
                <li>ปริมาณการจัดสรรสินค้า</li>
                <li>ปริมาณสินค้าคงคลัง</li>
                <li>แนวโน้มคำสั่งซื้อของลูกค้า</li>
                <li>ประสิทธิภาพการจัดสรรสินค้า</li>
              </ul>

              <h4 className="text-lg font-semibold">
                3. ระบบส่งออกข้อมูล (Export Data)
              </h4>
              <p>
                เพิ่มความสามารถในการส่งออกข้อมูลในรูปแบบต่าง ๆ เช่น
              </p>
              <ul className="list-disc pl-5">
                <li>Excel (.xlsx)</li>
                <li>CSV</li>
                <li>PDF Report</li>
              </ul>
              <p>
                เพื่อรองรับการนำข้อมูลไปวิเคราะห์หรือจัดทำรายงานเพิ่มเติม
              </p>

              <h4 className="text-lg font-semibold">
                4. ระบบค้นหาและกรองข้อมูลขั้นสูง
              </h4>
              <p>
                พัฒนาระบบค้นหาและกรองข้อมูลให้มีความยืดหยุ่นมากขึ้น
                รองรับการค้นหาหลายเงื่อนไขพร้อมกัน รวมถึงการบันทึก Filter ที่ใช้งานบ่อย
                เพื่อเพิ่มประสิทธิภาพในการจัดการข้อมูลจำนวนมาก
              </p>

              <h4 className="text-lg font-semibold">
                5. ระบบบันทึกประวัติการจัดสรร (Allocation History)
              </h4>
              <p>
                เพิ่มระบบบันทึกประวัติการจัดสรรและการแก้ไขข้อมูล
                เพื่อให้สามารถตรวจสอบย้อนหลังได้ว่าใครเป็นผู้ดำเนินการ
                และมีการเปลี่ยนแปลงข้อมูลใดบ้าง
              </p>

              <h4 className="text-lg font-semibold">
                6. ระบบจัดการข้อมูลพื้นฐาน (Master Data Management)
              </h4>
              <p>
                เพิ่มหน้าสำหรับลงทะเบียนและจัดการข้อมูลพื้นฐานของระบบ เช่น
              </p>
              <ul className="list-disc pl-5">
                <li>สินค้า (Products / Items)</li>
                <li>คลังสินค้า (Warehouses)</li>
                <li>ผู้จัดจำหน่าย (Suppliers)</li>
                <li>ลูกค้า (Customers)</li>
                <li>ราคาสินค้าต่อหน่วย (Unit Price)</li>
                <li>เงื่อนไขราคาตามประเภทคำสั่งซื้อ</li>
              </ul>
              <p>
                เพื่อให้ผู้ดูแลระบบสามารถเพิ่ม แก้ไข หรือลบข้อมูลที่จำเป็นต่อการจัดสรรสินค้าได้
                โดยไม่ต้องแก้ไขข้อมูลในโค้ดโดยตรง
              </p>

              <hr className="my-2" />

              <h3 className="text-xl font-semibold">
                การพัฒนาด้านเทคนิค
              </h3>

              <h4 className="text-lg font-semibold">
                1. เชื่อมต่อข้อมูลผ่าน API และฐานข้อมูลจริง
              </h4>
              <p>
                เปลี่ยนจากการใช้ Mock Data เป็นการเชื่อมต่อกับ API และฐานข้อมูลจริง
                เพื่อรองรับการใช้งานในสภาพแวดล้อมจริง โดยสามารถ
              </p>
              <ul className="list-disc pl-5">
                <li>ดึงข้อมูลจากระบบภายนอก</li>
                <li>บันทึกข้อมูล</li>
                <li>แก้ไขข้อมูล</li>
                <li>อัปเดตข้อมูลแบบ Real-time</li>
              </ul>
              <p>ได้อย่างมีประสิทธิภาพ</p>

              <h4 className="text-lg font-semibold">
                2. ปรับปรุงระบบจัดการ State
              </h4>
              <p>
                หากระบบมีความซับซ้อนเพิ่มขึ้นในอนาคต ควรพิจารณาใช้งานเครื่องมือจัดการ State
                เช่น Redux Toolkit เพื่อให้การจัดการข้อมูลภายในระบบมีความเป็นระเบียบ
                ดูแลรักษาได้ง่าย และรองรับการขยายระบบในระยะยาว
              </p>

              <h4 className="text-lg font-semibold">
                3. เพิ่มระบบทดสอบอัตโนมัติ (Automated Testing)
              </h4>
              <p>
                พัฒนาระบบทดสอบทั้งในระดับ Unit Test และ Integration Test
                เพื่อเพิ่มความน่าเชื่อถือของระบบ
                และลดความเสี่ยงจากข้อผิดพลาดที่อาจเกิดขึ้นจากการพัฒนาในอนาคต
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-sm leading-7">
              <h2 className="text-2xl font-bold">User Guide</h2>

              <h3 className="text-xl font-semibold">1. Dashboard</h3>
              <p>
                The Dashboard displays all salmon orders received
                from customers and provides an automated allocation
                system to assist with order fulfillment.
              </p>

              <h4 className="text-lg font-semibold">
                1.1 Auto Allocation
              </h4>
              <p>
                When the Dashboard page is loaded, the system
                automatically performs the allocation process and
                displays the result in a preview dialog before
                confirmation.
              </p>

              <h4 className="text-lg font-semibold">1.2 Allocation Logic</h4>
              <p>
                Orders are allocated based on the following priority
                levels:
              </p>
              <ul className="list-disc pl-5">
                <li>Emergency</li>
                <li>Overdue</li>
                <li>Daily</li>
              </ul>
              <p>
                If multiple orders share the same priority level,
                the system applies the FIFO (First In, First Out)
                principle, giving precedence to orders received
                earlier.
              </p>
              <p>
                The system also validates each customer&apos;s available
                credit to prevent allocations that exceed their
                remaining credit limit.
              </p>

              <h5 className="font-semibold">
                1.2.1 Order Priority and Pricing
              </h5>
              <p>
                Different order priorities may result in different
                unit prices used during the allocation process.
              </p>

              <h4 className="text-lg font-semibold">1.3 Inventory Selection</h4>
              <p>
                The allocation engine searches inventory records
                based on the Warehouse ID and Supplier ID specified
                in the order.
              </p>
              <p>
                If both Warehouse ID and Supplier ID are set to
                <code>000</code>, the system automatically selects
                inventory from the stock location with the highest
                available quantity.
              </p>

              <h4 className="text-lg font-semibold">1.4 Manual Adjustment</h4>
              <p>
                Users can manually modify allocation results in two
                ways:
              </p>
              <ul className="list-disc pl-5">
                <li>
                  Through the Auto Allocation Preview dialog
                </li>
                <li>Directly from the Orders Table</li>
              </ul>

              <h4 className="text-lg font-semibold">1.5 Search and Filtering</h4>
              <p>
                Orders can be searched using the following criteria:
              </p>
              <ul className="list-disc pl-5">
                <li>Order ID</li>
                <li>Sub Order ID</li>
                <li>Customer ID</li>
                <li>Date range</li>
              </ul>

              <hr className="my-2" />

              <h3 className="text-xl font-semibold">2. Inventory</h3>
              <p>
                The Inventory page displays available stock
                quantities across different warehouses.
              </p>
              <p>
                <strong>Note:</strong> In the current version,
                inventory data is mock data and will not be
                automatically updated after allocations are
                performed.
              </p>

              <hr className="my-2" />

              <h3 className="text-xl font-semibold">3. Customer</h3>
              <p>
                The Customer page provides customer credit
                information, including:
              </p>
              <ul className="list-disc pl-5">
                <li>Credit Limit</li>
                <li>Used Credit</li>
                <li>Available Credit</li>
              </ul>
              <p>
                <strong>Note:</strong> In the current version,
                customer data is mock data and will not be
                automatically updated after allocations are
                performed.
              </p>

              <hr className="my-2" />

              <h2 className="text-2xl font-bold">
                Future Improvements
              </h2>

              <h3 className="text-xl font-semibold">
                UI and System Enhancements
              </h3>

              <h4 className="text-lg font-semibold">
                1. Authentication and Authorization
              </h4>
              <p>
                Implement user authentication and authorization to
                secure access to the system, as the application is
                intended for internal business operations and contains
                sensitive customer, inventory, and allocation data.
              </p>

              <h4 className="text-lg font-semibold">
                2. Analytics Dashboard
              </h4>
              <p>
                Introduce graphical data visualization, including
                charts and dashboards, to provide better insights into
                order allocation, inventory utilization, customer
                demand, and operational performance.
              </p>

              <h4 className="text-lg font-semibold">
                3. Data Export Functionality
              </h4>
              <p>
                Add support for exporting data into various formats,
                including:
              </p>
              <ul className="list-disc pl-5">
                <li>Microsoft Excel (.xlsx)</li>
                <li>CSV</li>
                <li>PDF reports</li>
              </ul>
              <p>
                This will allow users to perform further analysis and
                generate business reports outside the system.
              </p>

              <h4 className="text-lg font-semibold">
                4. Enhanced Search and Filtering
              </h4>
              <p>
                Expand search and filtering capabilities with advanced
                criteria, saved filters, and customizable views to
                improve the user experience when managing large volumes
                of orders.
              </p>

              <h4 className="text-lg font-semibold">
                5. Allocation History and Audit Log
              </h4>
              <p>
                Implement allocation history tracking and audit logs to
                record changes made by users, providing better
                traceability and accountability for allocation
                decisions.
              </p>

              <h4 className="text-lg font-semibold">
                6. Master Data Management
              </h4>
              <p>
                Implement dedicated management pages for maintaining
                core business data, including:
              </p>
              <ul className="list-disc pl-5">
                <li>Products / Items</li>
                <li>Warehouses</li>
                <li>Suppliers</li>
                <li>Customers</li>
                <li>Unit Pricing</li>
                <li>Pricing Rules based on Order Priority</li>
              </ul>
              <p>
                This feature will allow administrators to create,
                update, and manage essential business data directly
                through the system without modifying application code.
              </p>

              <hr className="my-2" />

              <h3 className="text-xl font-semibold">
                Technical Improvements
              </h3>

              <h4 className="text-lg font-semibold">
                1. Backend API Integration
              </h4>
              <p>
                Replace mock data with real backend APIs and database
                integration to support:
              </p>
              <ul className="list-disc pl-5">
                <li>Real-time data retrieval</li>
                <li>Data creation and updates</li>
                <li>Inventory synchronization</li>
                <li>Persistent storage</li>
              </ul>
              <p>
                This will allow the system to operate in a production
                environment with live business data.
              </p>

              <h4 className="text-lg font-semibold">
                2. State Management Architecture
              </h4>
              <p>
                Adopt a dedicated state management solution such as
                Redux Toolkit when application complexity increases.
              </p>
              <p>Benefits include:</p>
              <ul className="list-disc pl-5">
                <li>Centralized state management</li>
                <li>Improved maintainability</li>
                <li>Predictable state updates</li>
                <li>Easier debugging and scalability</li>
              </ul>

              <h4 className="text-lg font-semibold">
                3. Automated Testing
              </h4>
              <p>
                Implement unit tests and integration tests to improve
                software reliability and reduce regression issues during
                future development.
              </p>
            </div>
          )}
        </div>

        <div>
          <Link
            href="/dashboard"
            className="inline-flex rounded-md border px-4 py-2 text-sm font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
