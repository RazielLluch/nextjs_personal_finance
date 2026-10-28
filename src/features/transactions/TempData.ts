import type { Transaction } from "./types"

export const transactions: Transaction[] = [
  {
    id: 2,
    account_id: 2,
    remark: "Another transaction",
    date: new Date(),
    items: [
      {
        id: 2,
        amount: 50.0,
        category: "Transport",
        payee: 2,
        remark: "Another item",
        created_at: new Date(),
      }
    ],
    created_at: new Date(),
    type: "payment"
  },
  {
    id: 3,
    account_id: 1,
    remark: "Grocery shopping",
    date: new Date(2026, 9, 15),
    items: [
      {
        id: 3,
        amount: 85.50,
        category: "Food",
        payee: 3,
        remark: "Weekly groceries",
        created_at: new Date(2026, 9, 15),
      },
      {
        id: 4,
        amount: 12.75,
        category: "Food",
        payee: 3,
        remark: "Milk and eggs",
        created_at: new Date(2026, 9, 15),
      }
    ],
    created_at: new Date(2026, 9, 15),
    type: "payment"
  },
  {
    id: 4,
    account_id: 3,
    remark: "Office supplies",
    date: new Date(2026, 9, 20),
    items: [
      {
        id: 5,
        amount: 45.00,
        category: "Supplies",
        payee: 4,
        remark: "Printer paper and pens",
        created_at: new Date(2026, 9, 20),
      }
    ],
    created_at: new Date(2026, 9, 20),
    type: "payment"
  },
  {
    id: 5,
    account_id: 1,
    remark: "Utility bill payment",
    date: new Date(2026, 9, 25),
    items: [
      {
        id: 6,
        amount: 120.30,
        category: "Utilities",
        payee: 5,
        remark: "Electricity bill",
        created_at: new Date(2026, 9, 25),
      },
      {
        id: 7,
        amount: 85.60,
        category: "Utilities",
        payee: 5,
        remark: "Water bill",
        created_at: new Date(2026, 9, 25),
      }
    ],
    created_at: new Date(2026, 9, 25),
    type: "payment"
  },
  {
    id: 6,
    account_id: 2,
    remark: "Restaurant dinner",
    date: new Date(2026, 10, 5),
    items: [
      {
        id: 8,
        amount: 78.90,
        category: "Dining Out",
        payee: 6,
        remark: "Family dinner at Italian place",
        created_at: new Date(2026, 10, 5),
      }
    ],
    created_at: new Date(2026, 10, 5),
    type: "payment"
  },
  {
    id: 7,
    account_id: 3,
    remark: "Software subscription",
    date: new Date(2026, 10, 8),
    items: [
      {
        id: 9,
        amount: 29.99,
        category: "Subscriptions",
        payee: 7,
        remark: "Cloud storage service",
        created_at: new Date(2026, 10, 8),
      }
    ],
    created_at: new Date(2026, 10, 8),
    type: "payment"
  },
  {
    id: 8,
    account_id: 1,
    remark: "Pharmacy visit",
    date: new Date(2026, 10, 12),
    items: [
      {
        id: 10,
        amount: 34.50,
        category: "Healthcare",
        payee: 8,
        remark: "Prescription medications",
        created_at: new Date(2026, 10, 12),
      }
    ],
    created_at: new Date(2026, 10, 12),
    type: "payment"
  },
  {
    id: 9,
    account_id: 3,
    remark: "Internet service",
    date: new Date(2026, 10, 15),
    items: [
      {
        id: 11,
        amount: 95.00,
        category: "Utilities",
        payee: 9,
        remark: "Monthly internet bill",
        created_at: new Date(2026, 10, 15),
      }
    ],
    created_at: new Date(2026, 10, 15),
    type: "payment"
  },
  {
    id: 10,
    account_id: 2,
    remark: "Coffee shop",
    date: new Date(2026, 10, 18),
    items: [
      {
        id: 12,
        amount: 15.75,
        category: "Dining Out",
        payee: 10,
        remark: "Morning coffee and pastry",
        created_at: new Date(2026, 10, 18),
      }
    ],
    created_at: new Date(2026, 10, 18),
    type: "payment"
  },
  {
    id: 11,
    account_id: 3,
    remark: "Book purchase",
    date: new Date(2026, 10, 22),
    items: [
      {
        id: 13,
        amount: 42.99,
        category: "Books",
        payee: 11,
        remark: "Professional development book",
        created_at: new Date(2026, 10, 22),
      }
    ],
    created_at: new Date(2026, 10, 22),
    type: "payment"
  },
  {
    id: 12,
    account_id: 1,
    remark: "Gas station",
    date: new Date(2026, 10, 25),
    items: [
      {
        id: 14,
        amount: 68.50,
        category: "Transport",
        payee: 12,
        remark: "Fuel for car",
        created_at: new Date(2026, 10, 25),
      }
    ],
    created_at: new Date(2026, 10, 25),
    type: "payment"
  },
  {
    id: 13,
    account_id: 3,
    remark: "Streaming service",
    date: new Date(2026, 10, 27),
    items: [
      {
        id: 15,
        amount: 14.99,
        category: "Subscriptions",
        payee: 13,
        remark: "Video streaming subscription",
        created_at: new Date(2026, 10, 27),
      }
    ],
    created_at: new Date(2026, 10, 27),
    type: "payment"
  },
  {
    id: 14,
    account_id: 2,
    remark: "Grocery store",
    date: new Date(2026, 10, 28),
    items: [
      {
        id: 16,
        amount: 95.25,
        category: "Food",
        payee: 3,
        remark: "Weekly groceries - October",
        created_at: new Date(2026, 10, 28),
      },
      {
        id: 17,
        amount: 8.50,
        category: "Food",
        payee: 3,
        remark: "Snacks and beverages",
        created_at: new Date(2026, 10, 28),
      }
    ],
    created_at: new Date(2026, 10, 28),
    type: "payment"
  },
  {
    id: 15,
    account_id: 3,
    remark: "Office equipment",
    date: new Date(2026, 10, 29),
    items: [
      {
        id: 18,
        amount: 156.75,
        category: "Supplies",
        payee: 4,
        remark: "New laptop for work",
        created_at: new Date(2026, 10, 29),
      }
    ],
    created_at: new Date(2026, 10, 29),
    type: "payment"
  },
  {
    id: 16,
    account_id: 1,
    remark: "Medical appointment",
    date: new Date(2026, 10, 30),
    items: [
      {
        id: 19,
        amount: 250.00,
        category: "Healthcare",
        payee: 8,
        remark: "Doctor consultation and lab tests",
        created_at: new Date(2026, 10, 30),
      }
    ],
    created_at: new Date(2026, 10, 30),
    type: "payment"
  },
  {
    id: 17,
    account_id: 2,
    remark: "Movie theater",
    date: new Date(2026, 10, 31),
    items: [
      {
        id: 20,
        amount: 45.00,
        category: "Entertainment",
        payee: 14,
        remark: "Weekend movie tickets and snacks",
        created_at: new Date(2026, 10, 31),
      }
    ],
    created_at: new Date(2026, 10, 31),
    type: "payment"
  },
  {
    id: 18,
    account_id: 3,
    remark: "Bank fees",
    date: new Date(2026, 11, 1),
    items: [
      {
        id: 21,
        amount: 12.50,
        category: "Fees",
        payee: 15,
        remark: "Monthly bank service charge",
        created_at: new Date(2026, 11, 1),
      }
    ],
    created_at: new Date(2026, 11, 1),
    type: "payment"
  },
  {
    id: 19,
    account_id: 3,
    remark: "Salary",
    date: new Date(2026, 11, 1),
    items: [
      {
        id: 22,
        amount: 25000.00,
        category: "salary",
        payee: 15,
        remark: "November salary",
        created_at: new Date(2026, 11, 1),
      }
    ],
    created_at: new Date(2026, 11, 1),
    type: "deposit"
  },
]