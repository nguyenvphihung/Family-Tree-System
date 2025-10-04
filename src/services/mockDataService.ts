// Mock data cho chức năng góp quỹ
export interface FundData {
  totalAmount: number;
  targetAmount: number;
  contributors: number;
  lastUpdated: string;
  progressPercentage: number;
}

export interface Contribution {
  id: string;
  contributorName: string;
  amount: number;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
  paymentMethod: string;
  transactionId: string;
}

export interface FundraisingStats {
  totalContributions: number;
  averageContribution: number;
  topContributors: Array<{
    name: string;
    totalAmount: number;
    contributions: number;
  }>;
  monthlyStats: Array<{
    month: string;
    amount: number;
    contributors: number;
  }>;
}

class MockDataService {
  private fundData: FundData = {
    totalAmount: 15750000, // 15.75 triệu VND
    targetAmount: 50000000, // 50 triệu VND
    contributors: 127,
    lastUpdated: new Date().toISOString(),
    progressPercentage: 31.5
  };

  private contributions: Contribution[] = [
    {
      id: 'CONT_001',
      contributorName: 'Nguyễn Văn An',
      amount: 500000,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 giờ trước
      status: 'success',
      paymentMethod: 'ATM',
      transactionId: 'TXN_' + Date.now()
    },
    {
      id: 'CONT_002',
      contributorName: 'Trần Thị Bình',
      amount: 200000,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 giờ trước
      status: 'success',
      paymentMethod: 'Visa',
      transactionId: 'TXN_' + (Date.now() - 1)
    },
    {
      id: 'CONT_003',
      contributorName: 'Lê Văn Cường',
      amount: 1000000,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 ngày trước
      status: 'success',
      paymentMethod: 'ATM',
      transactionId: 'TXN_' + (Date.now() - 2)
    },
    {
      id: 'CONT_004',
      contributorName: 'Phạm Thị Dung',
      amount: 300000,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 ngày trước
      status: 'success',
      paymentMethod: 'Mastercard',
      transactionId: 'TXN_' + (Date.now() - 3)
    },
    {
      id: 'CONT_005',
      contributorName: 'Hoàng Văn Em',
      amount: 750000,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 ngày trước
      status: 'success',
      paymentMethod: 'ATM',
      transactionId: 'TXN_' + (Date.now() - 4)
    }
  ];

  private fundraisingStats: FundraisingStats = {
    totalContributions: 127,
    averageContribution: 124015,
    topContributors: [
      { name: 'Nguyễn Văn An', totalAmount: 2500000, contributions: 5 },
      { name: 'Trần Thị Bình', totalAmount: 1800000, contributions: 3 },
      { name: 'Lê Văn Cường', totalAmount: 1500000, contributions: 2 },
      { name: 'Phạm Thị Dung', totalAmount: 1200000, contributions: 4 },
      { name: 'Hoàng Văn Em', totalAmount: 1000000, contributions: 2 }
    ],
    monthlyStats: [
      { month: 'Tháng 1/2024', amount: 2500000, contributors: 15 },
      { month: 'Tháng 2/2024', amount: 3200000, contributors: 22 },
      { month: 'Tháng 3/2024', amount: 4100000, contributors: 28 },
      { month: 'Tháng 4/2024', amount: 3800000, contributors: 25 },
      { month: 'Tháng 5/2024', amount: 2150000, contributors: 18 }
    ]
  };

  // Get current fund data
  getFundData(): FundData {
    return { ...this.fundData };
  }

  // Get recent contributions
  getRecentContributions(limit: number = 10): Contribution[] {
    return this.contributions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Get fundraising statistics
  getFundraisingStats(): FundraisingStats {
    return { ...this.fundraisingStats };
  }

  // Add new contribution
  addContribution(contribution: Omit<Contribution, 'id' | 'timestamp' | 'status' | 'transactionId'>): Contribution {
    const newContribution: Contribution = {
      ...contribution,
      id: `CONT_${String(this.contributions.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
      status: 'success',
      transactionId: `TXN_${Date.now()}`
    };

    this.contributions.unshift(newContribution);
    
    // Update fund data
    this.fundData.totalAmount += contribution.amount;
    this.fundData.contributors += 1;
    this.fundData.progressPercentage = (this.fundData.totalAmount / this.fundData.targetAmount) * 100;
    this.fundData.lastUpdated = new Date().toISOString();

    return newContribution;
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  // Format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Vừa xong';
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  }

  // Generate random contributors for demo
  generateRandomContributors(count: number): Contribution[] {
    const names = [
      'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường', 'Phạm Thị Dung', 'Hoàng Văn Em',
      'Vũ Thị Phương', 'Đặng Văn Giang', 'Bùi Thị Hoa', 'Phan Văn Ích', 'Võ Thị Kim',
      'Ngô Văn Long', 'Đinh Thị Mai', 'Tôn Văn Nam', 'Lý Thị Oanh', 'Hồ Văn Phúc'
    ];
    
    const paymentMethods = ['ATM', 'Visa', 'Mastercard', 'JCB'];
    const amounts = [100000, 200000, 300000, 500000, 750000, 1000000, 1500000, 2000000];
    
    const contributors: Contribution[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const randomHoursAgo = Math.floor(Math.random() * 24);
      const timestamp = new Date(Date.now() - (randomDaysAgo * 24 + randomHoursAgo) * 60 * 60 * 1000);
      
      contributors.push({
        id: `CONT_${String(this.contributions.length + i + 1).padStart(3, '0')}`,
        contributorName: names[Math.floor(Math.random() * names.length)],
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        timestamp: timestamp.toISOString(),
        status: 'success',
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        transactionId: `TXN_${Date.now() - i}`
      });
    }
    
    return contributors.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

export const mockDataService = new MockDataService();
export default mockDataService;
