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
import { useCurrentTreeStore } from '@/store';
type FundTransaction = {
    fundTransactionId: string;
    amount: number;
    content: string;
    createdAt: string;
};
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
    const currentTree = useCurrentTreeStore((s) => s.currentTree);

    // Form state
    const [fundId, setFundId] = useState('');
    const [amount, setAmount] = useState('');
    const [content, setContent] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Transaction list state
    const [transactions, setTransactions] = useState<FundTransaction[]>([]);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
    const [selectedFundId, setSelectedFundId] = useState('');

    // Format amount input with thousand separators (.)
    const formatAmountInput = (raw: string) => {
        const digitsOnly = raw.replace(/\D/g, '');
        if (!digitsOnly) return '';
        return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Quick amount options (giống HTML)
    const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

    // Normalize formatted amount -> number value
    const normalizeAmountToNumber = (formatted: string): number => {
        const digitsOnly = (formatted || '').replace(/\D/g, '');
        if (!digitsOnly) return NaN;
        return parseInt(digitsOnly, 10);
    };

    // Read Vietnamese number (simple, up to billions)
    const readVietnameseNumber = (value: number): string => {
        if (!isFinite(value) || value < 0) return '';
        if (value === 0) return 'không đồng';
        const dv = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
        const readHundreds = (n: number, full: boolean): string => {
            const tr = Math.floor(n / 100), ch = Math.floor((n % 100) / 10), dvn = n % 10;
            let str = '';
            if (full || tr > 0) {
                str += dv[tr] + ' trăm';
                if (ch === 0 && dvn > 0) str += ' lẻ';
            }
            if (ch > 1) {
                str += ' ' + dv[ch] + ' mươi';
                if (dvn === 1) str += ' mốt';
                else if (dvn === 4) str += ' tư';
                else if (dvn === 5) str += ' lăm';
                else if (dvn > 0) str += ' ' + dv[dvn];
            } else if (ch === 1) {
                str += ' mười';
                if (dvn === 5) str += ' lăm';
                else if (dvn > 0) str += ' ' + dv[dvn];
            } else if (dvn > 0 && (full || tr > 0)) {
                str += ' ' + dv[dvn];
            } else if (dvn > 0) {
                str += dv[dvn];
            }
            return str.trim();
        };
        const units = ['', ' nghìn', ' triệu', ' tỷ'];
        let i = 0, str = '';
        while (value > 0 && i < units.length) {
            const block = value % 1000;
            if (block > 0) {
                const blockStr = readHundreds(block, str !== '');
                str = blockStr + units[i] + (str ? ' ' + str : '');
            }
            value = Math.floor(value / 1000);
            i++;
        }
        return (str + ' đồng').replace(/\s+/g, ' ').trim();
    };

    useEffect(() => {
        if (currentTree?.fundId) {
            setFundId(currentTree.fundId);
            setSelectedFundId(currentTree.fundId);
        }
    }, [currentTree?.fundId]);

    // Create payment
    const handleCreatePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fundId || !amount) {
            toast({
                title: 'Lỗi',
                description: 'Vui lòng điền đầy đủ thông tin',
                variant: 'destructive',
            });
            return;
        }

        const amountNum = normalizeAmountToNumber(amount);
        if (isNaN(amountNum) || amountNum < 10000 || amountNum > 5000000) {
            toast({
                title: 'Lỗi',
                description: 'Số tiền phải từ 10,000 VNĐ đến 5,000,000 VNĐ',
                variant: 'destructive',
            });
            return;
        }

        setIsCreating(true);
        try {
            console.log('💳 Creating payment:', { fundId, amount: amountNum, content });
            const response = await vnpayService.createPayment({
                fundId,
                amount: amountNum,
                content,
            });
            console.log('📦 Create payment response:', response);

            if (response.data?.paymentUrl) {
                console.log('🔗 Redirecting to payment URL:', response.data.paymentUrl);
                console.log('⚠️ NOTE: Transaction will only be saved AFTER completing payment on VNPay');
                toast({
                    title: 'Tạo yêu cầu thanh toán thành công',
                    description: 'Đang chuyển đến VNPay. Vui lòng hoàn tất thanh toán để giao dịch được lưu.',
                });
                // Redirect to VNPay payment page
                window.location.href = response.data.paymentUrl;
            } else {
                console.log('✅ Payment created successfully (no redirect)');
                console.log('⚠️ WARNING: No paymentUrl in response - transaction may not be saved');
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
            console.error('❌ Create payment error:', error);
            console.error('Error response:', error.response);
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
            console.log('🔍 Fetching transactions for fundId:', selectedFundId);
            const response = await vnpayService.getFundTransactions(selectedFundId);
            console.log('📦 Get transactions response:', response);

            setTransactions(response.data || []);

            if (!response.data || response.data.length === 0) {
                console.warn('⚠️ No transactions found for fundId:', selectedFundId);
                console.warn('💡 Possible reasons:');
                console.warn('   1. Fund ID không tồn tại trong hệ thống');
                console.warn('   2. Chưa có giao dịch nào được hoàn tất cho Fund này');
                console.warn('   3. Giao dịch đang chờ xử lý (chưa thanh toán trên VNPay)');
                toast({
                    title: 'Không có giao dịch',
                    description: 'Chưa có giao dịch nào được hoàn tất cho Fund ID này. Vui lòng hoàn tất thanh toán trên VNPay trước.',
                });
            } else {
                console.log('✅ Found transactions:', response.data.length);
                toast({
                    title: 'Thành công',
                    description: `Tìm thấy ${response.data.length} giao dịch`,
                });
            }
        } catch (error: any) {
            console.error('❌ Get transactions error:', error);
            console.error('Error response:', error.response);
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
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="1.000.000"
                                            value={amount}
                                            onChange={(e) => setAmount(formatAmountInput(e.target.value))}
                                            required
                                        />
                                        {/* Quick amount options giống HTML */}
                                        <div className="flex gap-2 mb-2">
                                            {quickAmounts.map((amt) => (
                                                <Button
                                                    key={amt}
                                                    type="button"
                                                    variant={normalizeAmountToNumber(amount) === amt ? "default" : "outline"}
                                                    onClick={() => setAmount(formatAmountInput(amt.toString()))}
                                                >
                                                    {amt.toLocaleString()}đ
                                                </Button>
                                            ))}
                                        </div>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <p>Số tiền phải từ 10,000 VNĐ đến 5,000,000 VNĐ</p>
                                            {amount && (
                                                <p>
                                                    Bạn góp <span className="font-semibold">{readVietnameseNumber(normalizeAmountToNumber(amount))}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="content">
                                            Nội dung (Tùy chọn)
                                        </Label>
                                        <Textarea
                                            id="content"
                                            placeholder="Thanh toán cho..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows={3}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Mô tả chi tiết về giao dịch
                                        </p>
                                    </div>

                                    <Alert>
                                        <AlertDescription className="space-y-2">
                                            <p><strong>⚠️ Quan trọng:</strong></p>
                                            <ol className="list-decimal list-inside space-y-1 text-sm">
                                                <li>Nhấn "Tạo thanh toán" để tạo yêu cầu thanh toán</li>
                                                <li>Bạn sẽ được chuyển đến trang VNPay</li>
                                                <li>Hoàn tất thanh toán trên VNPay (quét QR/nhập thẻ)</li>
                                                <li><strong>CHỈ SAU KHI thanh toán thành công</strong>, giao dịch mới xuất hiện trong lịch sử</li>
                                            </ol>
                                        </AlertDescription>
                                    </Alert>

                                    <Button type="submit" className="w-full" disabled={isCreating}>
                                        {isCreating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang tạo link thanh toán...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="mr-2 h-4 w-4" />
                                                Tạo thanh toán
                                            </>
                                        )}
                                    </Button>
                                    {/* Loading overlay giống HTML */}
                                    {isCreating && (
                                        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                                            <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
                                                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mb-4"></div>
                                                <p className="text-lg font-semibold text-blue-600">Đang tạo link thanh toán...</p>
                                            </div>
                                        </div>
                                    )}
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
                                    Xem danh sách giao dịch <strong>ĐÃ HOÀN TẤT</strong> theo Fund ID.
                                    Chỉ các giao dịch đã thanh toán thành công trên VNPay mới hiển thị ở đây.
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
                                        <AlertDescription className="text-center py-8 space-y-3">
                                            {isLoadingTransactions ? (
                                                'Đang tải dữ liệu...'
                                            ) : (
                                                <div className="space-y-2">
                                                    <p className="font-medium">Chưa có giao dịch nào được tìm thấy</p>
                                                    <div className="text-sm text-muted-foreground text-left max-w-md mx-auto">
                                                        <p className="font-semibold mb-1">Có thể do:</p>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            <li>Fund ID chưa có trong hệ thống</li>
                                                            <li>Bạn mới tạo payment nhưng chưa thanh toán trên VNPay</li>
                                                            <li>Giao dịch đang được xử lý (thử lại sau vài phút)</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
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
