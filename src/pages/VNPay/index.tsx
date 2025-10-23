import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { vnpayService } from '@/services';
import type { FundTransaction } from '@/types/vnpay';
import {
    CreditCard,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    DollarSign,
    Receipt,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const VNPayPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    // Form state
    const [fundId, setFundId] = useState('');
    const [amount, setAmount] = useState('');
    const [content, setContent] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Transaction list state
    const [transactions, setTransactions] = useState<FundTransaction[]>([]);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
    const [selectedFundId, setSelectedFundId] = useState('');

    // Create payment
    const handleCreatePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fundId || !amount || !content) {
            toast({
                title: 'Lỗi',
                description: 'Vui lòng điền đầy đủ thông tin',
                variant: 'destructive',
            });
            return;
        }

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum < 5000) {
            toast({
                title: 'Lỗi',
                description: 'Số tiền phải lớn hơn hoặc bằng 5,000 VNĐ',
                variant: 'destructive',
            });
            return;
        }

        setIsCreating(true);
        try {
            const response = await vnpayService.createPayment({
                fundId,
                amount: amountNum,
                content,
            });

            if (response.data?.paymentUrl) {
                toast({
                    title: 'Thành công',
                    description: 'Đang chuyển đến trang thanh toán...',
                });
                // Redirect to VNPay payment page
                window.location.href = response.data.paymentUrl;
            } else {
                toast({
                    title: 'Thành công',
                    description: 'Tạo thanh toán thành công!',
                });
                // Reset form
                setFundId('');
                setAmount('');
                setContent('');
            }
        } catch (error: any) {
            console.error('Create payment error:', error);
            toast({
                title: 'Lỗi tạo thanh toán',
                description: error.response?.data?.message || 'Không thể tạo thanh toán',
                variant: 'destructive',
            });
        } finally {
            setIsCreating(false);
        }
    };

    // Get fund transactions
    const handleGetTransactions = async () => {
        if (!selectedFundId) {
            toast({
                title: 'Lỗi',
                description: 'Vui lòng nhập Fund ID',
                variant: 'destructive',
            });
            return;
        }

        setIsLoadingTransactions(true);
        try {
            const response = await vnpayService.getFundTransactions(selectedFundId);
            setTransactions(response.data || []);

            if (!response.data || response.data.length === 0) {
                toast({
                    title: 'Thông báo',
                    description: 'Không có giao dịch nào',
                });
            } else {
                toast({
                    title: 'Thành công',
                    description: `Tìm thấy ${response.data.length} giao dịch`,
                });
            }
        } catch (error: any) {
            console.error('Get transactions error:', error);
            toast({
                title: 'Lỗi tải giao dịch',
                description: error.response?.data?.message || 'Không thể tải danh sách giao dịch',
                variant: 'destructive',
            });
            setTransactions([]);
        } finally {
            setIsLoadingTransactions(false);
        }
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <CreditCard className="h-8 w-8 text-primary" />
                            VNPay Payment
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Quản lý thanh toán và giao dịch qua VNPay
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="create" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="create">Tạo thanh toán</TabsTrigger>
                        <TabsTrigger value="transactions">Lịch sử giao dịch</TabsTrigger>
                    </TabsList>

                    {/* Create Payment Tab */}
                    <TabsContent value="create">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Tạo thanh toán mới
                                </CardTitle>
                                <CardDescription>
                                    Điền thông tin để tạo yêu cầu thanh toán qua VNPay
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreatePayment} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fundId">
                                            Fund ID <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="fundId"
                                            placeholder="3fa85f64-5717-4562-b3fc-2c963f66afa6"
                                            value={fundId}
                                            onChange={(e) => setFundId(e.target.value)}
                                            required
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            ID của quỹ cần thanh toán (UUID format)
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="amount">
                                            Số tiền (VNĐ) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="5000000"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            min="5000"
                                            step="1000"
                                            required
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Số tiền tối thiểu: 5,000 VNĐ
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="content">
                                            Nội dung <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="content"
                                            placeholder="Thanh toán cho..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows={3}
                                            required
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Mô tả chi tiết về giao dịch
                                        </p>
                                    </div>

                                    <Alert>
                                        <AlertDescription>
                                            <strong>Lưu ý:</strong> Sau khi nhấn "Tạo thanh toán", bạn sẽ được
                                            chuyển đến trang thanh toán của VNPay để hoàn tất giao dịch.
                                        </AlertDescription>
                                    </Alert>

                                    <Button type="submit" className="w-full" disabled={isCreating}>
                                        {isCreating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="mr-2 h-4 w-4" />
                                                Tạo thanh toán
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Transactions Tab */}
                    <TabsContent value="transactions">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Receipt className="h-5 w-5" />
                                    Lịch sử giao dịch
                                </CardTitle>
                                <CardDescription>
                                    Xem danh sách giao dịch theo Fund ID
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Nhập Fund ID để tra cứu"
                                            value={selectedFundId}
                                            onChange={(e) => setSelectedFundId(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleGetTransactions();
                                                }
                                            }}
                                        />
                                    </div>
                                    <Button
                                        onClick={handleGetTransactions}
                                        disabled={isLoadingTransactions}
                                    >
                                        {isLoadingTransactions ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang tải...
                                            </>
                                        ) : (
                                            'Tìm kiếm'
                                        )}
                                    </Button>
                                </div>

                                {transactions.length > 0 ? (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>ID Giao dịch</TableHead>
                                                    <TableHead>Số tiền</TableHead>
                                                    <TableHead>Nội dung</TableHead>
                                                    <TableHead>Thời gian</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {transactions.map((transaction) => (
                                                    <TableRow key={transaction.fundTransactionId}>
                                                        <TableCell className="font-mono text-sm">
                                                            {transaction.fundTransactionId.substring(0, 8)}...
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary" className="font-semibold">
                                                                {formatCurrency(transaction.amount)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="max-w-md truncate">
                                                            {transaction.content}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Clock className="h-4 w-4" />
                                                                {formatDate(transaction.createdAt)}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <Alert>
                                        <AlertDescription className="text-center py-8">
                                            {isLoadingTransactions
                                                ? 'Đang tải dữ liệu...'
                                                : 'Chưa có giao dịch nào. Nhập Fund ID và nhấn "Tìm kiếm" để xem giao dịch.'}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Info Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tổng giao dịch</CardTitle>
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{transactions.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Giao dịch trong quỹ hiện tại
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tổng số tiền</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(
                                    transactions.reduce((sum, t) => sum + t.amount, 0)
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Tổng giá trị giao dịch
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Hoạt động</div>
                            <p className="text-xs text-muted-foreground">
                                Hệ thống thanh toán
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default VNPayPage;
