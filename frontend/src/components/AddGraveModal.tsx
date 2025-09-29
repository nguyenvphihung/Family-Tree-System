import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface AddGraveModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCoords?: { latitude: number; longitude: number } | null;
  onSaved?: () => void;
}

export function AddGraveModal({ isOpen, onClose, initialCoords = null, onSaved }: AddGraveModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [deathYear, setDeathYear] = useState('');
  const [latitude, setLatitude] = useState<string | number>(initialCoords?.latitude ?? '');
  const [longitude, setLongitude] = useState<string | number>(initialCoords?.longitude ?? '');
  const [directions, setDirections] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLatitude(initialCoords?.latitude ?? '');
    setLongitude(initialCoords?.longitude ?? '');
  }, [initialCoords, isOpen]);

  const handleNext = () => { if (step < 3) setStep(s => s + 1); };
  const handlePrev = () => { if (step > 1) setStep(s => s - 1); };

  const resetForm = () => {
    setStep(1);
    setName('');
    setBirthYear('');
    setDeathYear('');
    setLatitude(initialCoords?.latitude ?? '');
    setLongitude(initialCoords?.longitude ?? '');
    setDirections('');
  };

  const handleSubmit = async () => {
    setSaving(true);
    const payload = {
      name,
      years: `${birthYear || ''}-${deathYear || ''}`,
      latitude: Number(latitude) || 0,
      longitude: Number(longitude) || 0,
      status: 'unverified',
      description: directions || ''
    };

    try {
      const res = await fetch('/api/graves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        onSaved?.();
        onClose();
        resetForm();
      } else {
        const text = await res.text();
        console.error('Failed to save grave', res.status, text);
      }
    } catch (e) {
      console.error('Error creating grave', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Thêm mộ phần mới</span>
            <Badge variant="outline">Bước {step}/3</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Họ và Tên</Label>
                <Input value={name} onChange={(e: any) => setName(e.target.value)} placeholder="Tên người đã mất" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Năm sinh</Label>
                  <Input value={birthYear} onChange={(e: any) => setBirthYear(e.target.value)} placeholder="VD: 1932" />
                </div>
                <div>
                  <Label>Năm mất</Label>
                  <Input value={deathYear} onChange={(e: any) => setDeathYear(e.target.value)} placeholder="VD: 1998" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Vị trí trên bản đồ</Label>
                <Card className="h-44 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
                  <div className="text-center">
                    <div className="text-4xl mx-auto text-gray-400 mb-2">📍</div>
                    <p className="text-sm text-gray-500">Click vào bản đồ để chọn tọa độ, hoặc nhập tay bên dưới</p>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Vĩ độ</Label>
                  <Input value={latitude?.toString()} onChange={(e: any) => setLatitude(e.target.value)} placeholder="10.7769" />
                </div>
                <div>
                  <Label>Kinh độ</Label>
                  <Input value={longitude?.toString()} onChange={(e: any) => setLongitude(e.target.value)} placeholder="106.7009" />
                </div>
              </div>

              <div>
                <Label>Hướng dẫn</Label>
                <Textarea value={directions} onChange={(e: any) => setDirections(e.target.value)} rows={3} placeholder="Mô tả vị trí cụ thể" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Xác nhận</Label>
                <p className="text-sm text-gray-600">Kiểm tra thông tin và lưu vào hệ thống</p>
                <div className="mt-3 text-sm text-gray-700">
                  <div><strong>Tên:</strong> {name || '(chưa có)'}</div>
                  <div><strong>Năm:</strong> {`${birthYear || '?'} - ${deathYear || '?'}`}</div>
                  <div><strong>Tọa độ:</strong> {latitude},{' '}{longitude}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handlePrev} disabled={saving}>
                <span className="mr-2">←</span> Quay lại
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>Hủy</Button>
            {step < 3 ? (
              <Button onClick={handleNext} className="bg-[#FF4D73]" disabled={saving}>Tiếp tục <span className="ml-2">→</span></Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-[#FF4D73]" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu mộ phần'}</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}