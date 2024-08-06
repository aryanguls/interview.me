import React from 'react';
import Image from 'next/image';
import styles from './app.module.css';

interface Interview {
  id: string;
  name: string;
  status: 'Active' | 'Draft' | 'Archived';
  price: number;
  totalSales: number;
  createdAt: string;
}

const mockInterviews: Interview[] = [
  { id: '1', name: 'Smartphone X Pro', status: 'Active', price: 999.00, totalSales: 150, createdAt: '6/22/2024' },
  { id: '2', name: 'Wireless Earbuds Ultra', status: 'Active', price: 199.00, totalSales: 300, createdAt: '6/22/2024' },
  { id: '3', name: 'Smart Home Hub', status: 'Active', price: 149.00, totalSales: 200, createdAt: '6/22/2024' },
  { id: '4', name: '4K Ultra HD Smart TV', status: 'Active', price: 799.00, totalSales: 50, createdAt: '6/22/2024' },
  { id: '5', name: 'Gaming Laptop Pro', status: 'Active', price: 1299.00, totalSales: 75, createdAt: '6/22/2024' },
];

const Dashboard: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          <span>Dashboard</span> &gt; <span>Products</span> &gt; <span>All Products</span>
        </div>
        <div className={styles.headerRight}>
          <input type="search" placeholder="Search..." className={styles.searchInput} />
          <button className={styles.iconButton}>👤</button>
        </div>
      </header>

      <nav className={styles.nav}>
        <button className={styles.activeNav}>All</button>
        <button>Active</button>
        <button>Draft</button>
        <button>Archived</button>
      </nav>

      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <div>
            <h2>Products</h2>
            <p>Manage your products and view their sales performance.</p>
          </div>
          <div>
            <button className={styles.secondaryButton}>Export</button>
            <button className={styles.primaryButton}>Add Product</button>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Price</th>
              <th>Total Sales</th>
              <th>Created at</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mockInterviews.map((interview) => (
              <tr key={interview.id}>
                <td>
                  <div className={styles.productInfo}>
                    <Image src={`/product-images/${interview.id}.png`} alt={interview.name} width={40} height={40} />
                    <span>{interview.name}</span>
                  </div>
                </td>
                <td>{interview.status}</td>
                <td>${interview.price.toFixed(2)}</td>
                <td>{interview.totalSales}</td>
                <td>{interview.createdAt}</td>
                <td>...</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <span>Showing 1-5 of 10 products</span>
          <div>
            <button disabled>Prev</button>
            <button>Next</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;