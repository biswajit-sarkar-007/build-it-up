export const EXAMPLES = [
  {
    name: "Users & Orders",
    description: "E-commerce with nested orders",
    icon: "🛒",
    data: {
      users: [
        {
          id: 1,
          name: "Alice Johnson",
          email: "alice@example.com",
          created_at: "2024-01-15T10:30:00Z",
          address: {
            street: "123 Main St",
            city: "Portland",
            country: "US"
          },
          orders: [
            { id: 101, total: 59.99, status: "shipped", ordered_at: "2024-02-01T14:00:00Z" },
            { id: 102, total: 129.50, status: "pending", ordered_at: "2024-03-10T09:15:00Z" }
          ]
        },
        {
          id: 2,
          name: "Bob Smith",
          email: "bob@example.com",
          created_at: "2024-02-20T08:00:00Z",
          address: {
            street: "456 Oak Ave",
            city: "Seattle",
            country: "US"
          },
          orders: [
            { id: 103, total: 34.99, status: "paid", ordered_at: "2024-03-15T16:30:00Z" }
          ]
        }
      ]
    }
  },
  {
    name: "Blog Posts",
    description: "Articles with comments & tags",
    icon: "📝",
    data: [
      {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        title: "Getting Started with TypeScript",
        slug: "getting-started-typescript",
        content: "TypeScript is a strongly typed programming language that builds on JavaScript...",
        authorId: 1,
        published: true,
        created_at: "2024-01-10T12:00:00Z",
        tags: ["typescript", "javascript", "tutorial"],
        comments: [
          { id: 1, body: "Great article!", authorEmail: "reader@example.com", created_at: "2024-01-11T08:30:00Z" },
          { id: 2, body: "Very helpful, thanks!", authorEmail: "fan@example.com", created_at: "2024-01-12T14:00:00Z" }
        ]
      },
      {
        id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        title: "Advanced React Patterns",
        slug: "advanced-react-patterns",
        content: "Let's explore some advanced patterns in React including render props...",
        authorId: 2,
        published: false,
        created_at: "2024-02-05T09:00:00Z",
        tags: ["react", "javascript"],
        comments: []
      }
    ]
  },
  {
    name: "Flat Users",
    description: "Simple flat array of users",
    icon: "👥",
    data: [
      { id: 1, name: "Jane Doe", email: "jane@example.com", role: "admin", active: true, login_count: 42, last_login: "2024-03-01T10:00:00Z" },
      { id: 2, name: "John Roe", email: "john@example.com", role: "user", active: true, login_count: 7, last_login: "2024-03-05T14:30:00Z" },
      { id: 3, name: "Sam Fox", email: "sam@example.com", role: "user", active: false, login_count: 0, last_login: null }
    ]
  }
];
