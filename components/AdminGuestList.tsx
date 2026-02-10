
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  Users,
  CheckCircle,
  MessageSquare,
  Trash2,
  Search,
  Download,
  Loader2,
  UserCheck,
  UserMinus,
  Calendar,
  Link as LinkIcon,
  Copy,
  Plus,
  Send,
  UserPlus,
  X,
  Edit3,
  Check,
  Eye,
  AlertTriangle
} from 'lucide-react';

// ============ Toast Notification ============
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  const cfg: Record<string, { bg: string; icon: React.ReactNode }> = {
    success: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: <Check size={16} /> },
    error: { bg: 'bg-rose-50 border-rose-200 text-rose-700', icon: <AlertTriangle size={16} /> },
    info: { bg: 'bg-blue-50 border-blue-200 text-blue-700', icon: <CheckCircle size={16} /> }
  };
  return (
    <div className={`fixed top-4 right-4 px-5 py-3 rounded-xl border shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2 duration-300 ${cfg[type].bg}`} style={{ zIndex: 100002 }}>
      {cfg[type].icon}
      {message}
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

// ============ Confirm Modal ============
function ConfirmModal({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" style={{ zIndex: 100003 }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500"><AlertTriangle size={20} /></div>
          <h3 className="font-bold text-brown">{title}</h3>
        </div>
        <p className="text-sm text-muted mb-6" style={{ marginLeft: 52 }}>{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2.5 text-sm font-medium text-muted hover:bg-ivory rounded-xl transition-colors">Hủy</button>
          <button onClick={onConfirm} className="px-4 py-2.5 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors">Xóa</button>
        </div>
      </div>
    </div>
  );
}

// ============ Wish Message Modal ============
function WishModal({ guest, onClose }: { guest: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" style={{ zIndex: 100003 }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500"><MessageSquare size={18} /></div>
            <div>
              <h3 className="font-bold text-brown">{guest.guest_name}</h3>
              <p className="text-xxs text-slate-400">{guest.guest_group || 'Chung'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-ivory rounded-lg transition-colors text-muted-alt"><X size={18} /></button>
        </div>
        <div className="bg-ivory rounded-xl p-4">
          {guest.wish_message ? (
            <p className="text-sm text-brown leading-relaxed italic">"{guest.wish_message}"</p>
          ) : (
            <p className="text-sm text-slate-400 italic text-center py-4">Chưa có lời chúc</p>
          )}
        </div>
        {guest.attendance_status !== null && (
          <div className="mt-4 flex items-center gap-2 text-xs">
            {guest.attendance_status ? (
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg font-bold"><UserCheck size={14} /> Xác nhận • {guest.guest_count || 1} khách</span>
            ) : (
              <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg font-bold"><UserMinus size={14} /> Từ chối</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ Main Component ============
export default function AdminGuestList() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Create invite state
  const [newName, setNewName] = useState('');
  const [newGroup, setNewGroup] = useState('Bạn bè');
  const [isCreating, setIsCreating] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editGroup, setEditGroup] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Modals
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [wishTarget, setWishTarget] = useState<any>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  }, []);

  const getBaseUrl = () => window.location.origin + '/';

  const fetchGuests = async () => {
    setLoading(true);
    try {
      // Get current wedding ID first
      const { data: wedding } = await supabase.from('weddings').select('id').single();
      let query = supabase.from('guests').select('*').order('created_at', { ascending: false });
      if (wedding?.id) {
        query = query.eq('wedding_id', wedding.id);
      }
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching guests:', error.message);
      } else {
        if (data) setGuests(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching guests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();

    const channel = supabase
      .channel('public:guests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'guests' },
        () => fetchGuests()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const stats = useMemo(() => {
    const confirmed = guests.filter(g => g.attendance_status === true);
    return {
      totalInvited: guests.length,
      totalConfirmed: confirmed.reduce((sum, g) => sum + (g.guest_count || 1), 0),
      responses: guests.filter(g => g.attendance_status !== null).length,
      newWishes: guests.filter(g => g.wish_message).length
    };
  }, [guests]);

  const handleAddInvite = async () => {
    if (!newName.trim()) return;
    setIsCreating(true);

    try {
      // Logic tạo link: domain + ?to=Ten_Khach
      const encodedName = newName.trim().replace(/\s+/g, '_');
      const inviteLink = `${getBaseUrl()}?to=${encodeURIComponent(encodedName)}`;

      const { data: wedding } = await supabase.from('weddings').select('id').single();

      const { error } = await supabase
        .from('guests')
        .insert([{
          wedding_id: wedding?.id,
          guest_name: newName.trim(),
          guest_group: newGroup,
          status: 'invited', // Trạng thái mặc định khi tạo link
          invite_link: inviteLink,
          attendance_status: null // Chưa xác nhận
        }]);

      if (error) throw error;

      setNewName('');
      fetchGuests();
      showToast('Đã tạo lời mời thành công!', 'success');
    } catch (err: any) {
      showToast('Lỗi: ' + err.message, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  // ============ Edit Guest ============
  const startEditing = (guest: any) => {
    setEditingId(guest.id);
    setEditName(guest.guest_name);
    setEditGroup(guest.guest_group || 'Bạn bè');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditGroup('');
  };

  const saveEdit = async () => {
    if (!editingId || !editName.trim()) return;
    setIsSavingEdit(true);
    try {
      const encodedName = editName.trim().replace(/\s+/g, '_');
      const inviteLink = `${getBaseUrl()}?to=${encodeURIComponent(encodedName)}`;
      const { error } = await supabase
        .from('guests')
        .update({ guest_name: editName.trim(), guest_group: editGroup, invite_link: inviteLink })
        .eq('id', editingId);
      if (error) throw error;
      cancelEditing();
      fetchGuests();
      showToast('Đã cập nhật thông tin khách mời!', 'success');
    } catch (err: any) {
      showToast('Lỗi: ' + err.message, 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // ============ Delete Guest ============
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('guests').delete().eq('id', id);
    if (!error) {
      setGuests(guests.filter(g => g.id !== id));
      showToast('Đã xóa khách mời!', 'info');
    } else {
      showToast('Lỗi khi xóa: ' + error.message, 'error');
    }
    setDeleteTarget(null);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Đã sao chép link mời!', 'info');
    } catch {
      showToast('Không thể sao chép. Hãy copy thủ công.', 'error');
    }
  };

  const exportToExcel = () => {
    if (guests.length === 0) {
      showToast('Chưa có dữ liệu khách mời để xuất!', 'error');
      return;
    }

    // BOM for UTF-8 encoding support in Excel
    const BOM = '\uFEFF';
    const headers = ['Tên khách mời', 'Nhóm', 'Số lượng', 'Trạng thái', 'Lời chúc', 'Link mời', 'Ngày tạo'];
    
    const rows = guests.map(g => [
      g.guest_name || '',
      g.guest_group || 'Chung',
      g.guest_count || 1,
      g.attendance_status === true ? 'Xác nhận' : g.attendance_status === false ? 'Từ chối' : 'Chưa phản hồi',
      (g.wish_message || '').replace(/"/g, '""'),
      g.invite_link || '',
      g.created_at ? new Date(g.created_at).toLocaleDateString('vi-VN') : ''
    ]);

    const csvContent = BOM + [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `danh-sach-khach-moi-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất file CSV thành công!', 'success');
  };

  const filteredGuests = guests.filter(g =>
    g.guest_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupOptions = ['Bạn bè', 'Đồng nghiệp', 'Họ hàng nội', 'Họ hàng ngoại', 'Khách quý'];

  return (
    <div className="flex flex-col h-full space-y-4 md:space-y-6 pb-8">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <ConfirmModal
          title="Xóa khách mời"
          message={`Bạn có chắc chắn muốn xóa "${deleteTarget.name}" khỏi danh sách?`}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {/* Wish Modal */}
      {wishTarget && <WishModal guest={wishTarget} onClose={() => setWishTarget(null)} />}
      <div className="flex flex-col xl:flex-row gap-4">
        {/* Create New Invite Section - Compact */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-warm flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
              <UserPlus size={16} />
            </div>
            <h2 className="text-sm font-bold text-brown">Tạo lời mời mới</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Nhập tên khách mời..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddInvite()}
              className="flex-1 px-3 py-2.5 bg-ivory border border-warm rounded-xl focus-gold text-sm font-medium"
            />
            <div className="flex gap-2">
              <select
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2.5 bg-ivory border border-warm rounded-xl focus-gold text-sm font-medium sm:w-32"
              >
                {groupOptions.map(g => <option key={g}>{g}</option>)}
              </select>
              <button
                onClick={handleAddInvite}
                disabled={isCreating || !newName.trim()}
                className="px-4 py-2.5 bg-gold text-white rounded-xl text-sm font-bold hover:bg-gold-dark transition-all disabled:opacity-50 flex items-center gap-1 shrink-0"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Tạo
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Responsive wrap */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:flex gap-3 shrink-0">
          <StatCard icon={<LinkIcon />} label="đã mời" value={stats.totalInvited} color="text-gold-deep bg-gold/10" />
          <StatCard icon={<CheckCircle />} label="phản hồi" value={stats.responses} color="text-emerald-600 bg-emerald-50" />
          <StatCard icon={<Users />} label="xác nhận" value={stats.totalConfirmed} color="text-gold bg-gold/10" />
          <StatCard icon={<MessageSquare />} label="lời chúc" value={stats.newWishes} color="text-amber-600 bg-amber-50" />
        </div>
      </div>

      {/* Table Section - MAIN FOCUS */}
      <div className="bg-white rounded-2xl shadow-sm border border-warm overflow-hidden flex flex-col flex-1">
        <div className="p-4 border-b border-warm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
            <h3 className="text-base md:text-lg font-bold text-brown shrink-0">
              Danh sách khách mời
              <span className="text-xs font-normal text-slate-400 ml-2">({filteredGuests.length})</span>
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-ivory border border-warm rounded-xl focus-gold text-sm"
              />
            </div>
          </div>
          <button onClick={exportToExcel} className="flex items-center justify-center gap-2 px-3 py-2.5 text-muted hover:text-brown font-bold text-xs bg-ivory border border-warm rounded-xl transition-colors">
            <Download className="w-4 h-4" /> Xuất Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left md:min-w-0" style={{ minWidth: '700px' }}>
            <thead className="bg-ivory text-xxs uppercase tracking-widest font-bold text-muted-alt">
              <tr>
                <th className="px-6 py-4">Khách mời</th>
                <th className="px-6 py-4">Nhóm</th>
                <th className="px-6 py-4 text-center">SL</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Link mời</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-300 mx-auto mb-2" />
                    <span className="text-sm text-slate-400">Đang tải dữ liệu...</span>
                  </td>
                </tr>
              ) : filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Users className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">
                      {searchTerm ? 'Không tìm thấy khách mời phù hợp' : 'Chưa có khách mời nào. Hãy tạo lời mời đầu tiên!'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="group hover:bg-ivory-warm transition-colors">
                    <td className="px-6 py-4">
                      {editingId === guest.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          className="px-2 py-1.5 bg-white border rounded-lg text-sm font-bold text-brown w-full focus-gold outline-none"
                          style={{ maxWidth: 180, borderColor: 'rgb(212 175 55 / 0.3)' }}
                          autoFocus
                        />
                      ) : (
                        <div>
                          <div className="font-bold text-brown">{guest.guest_name}</div>
                          <div className="text-xxs text-muted-alt mt-1 flex items-center gap-1">
                            <Calendar size={10} /> {new Date(guest.created_at).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === guest.id ? (
                        <select
                          value={editGroup}
                          onChange={(e) => setEditGroup(e.target.value)}
                          className="px-2 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
                        >
                          {groupOptions.map(g => <option key={g}>{g}</option>)}
                        </select>
                      ) : (
                        <span className="text-xs text-muted bg-ivory px-2 py-1 rounded-md">{guest.guest_group || 'Chung'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-gold-deep">{guest.guest_count || '--'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {guest.attendance_status === true ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xxs font-bold">
                            <UserCheck size={12} /> Xác nhận
                          </span>
                        ) : guest.attendance_status === false ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-600 rounded-full text-xxs font-bold">
                            <UserMinus size={12} /> Từ chối
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gold/10 text-gold-deep rounded-full text-xxs font-bold">
                            Đã gửi link
                          </span>
                        )}
                        {guest.wish_message && (
                          <button
                            onClick={() => setWishTarget(guest)}
                            className="p-1 text-amber-400 hover:text-amber-600 transition-colors"
                            title="Xem lời chúc"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="text-xxs text-slate-300 truncate font-mono" style={{ maxWidth: 120 }}>
                          {guest.invite_link}
                        </div>
                        <button
                          onClick={() => copyToClipboard(guest.invite_link)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Sao chép"
                        >
                          <Copy size={14} />
                        </button>
                        <a
                           href={guest.invite_link}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
                           title="Xem thiệp"
                        >
                          <Eye size={14} />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {editingId === guest.id ? (
                          <>
                            <button
                              onClick={saveEdit}
                              disabled={isSavingEdit || !editName.trim()}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xxs font-bold hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1 disabled:opacity-50"
                            >
                              {isSavingEdit ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Lưu
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-3 py-1.5 bg-ivory text-muted rounded-lg text-xxs font-bold hover:bg-warm transition-all"
                            >
                              Hủy
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(guest)}
                              className="p-2 text-slate-300 hover:text-blue-500 transition-colors"
                              title="Sửa"
                            >
                              <Edit3 size={14} />
                            </button>
                            <a
                              href={`https://zalo.me/share?url=${encodeURIComponent(guest.invite_link)}&title=${encodeURIComponent('Mời ' + guest.guest_name + ' đến dự đám cưới của chúng mình!')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-gold/10 text-gold-deep rounded-lg text-xxs font-bold hover:bg-gold hover:text-white transition-all flex items-center gap-1.5"
                              title="Gửi qua Zalo"
                            >
                              <Send size={12} /> Zalo
                            </a>
                            <button
                              onClick={() => setDeleteTarget({ id: guest.id, name: guest.guest_name })}
                              className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactElement; label: string; value: number; color: string }) {
  return (
    <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-warm flex items-center gap-3 flex-1" style={{ minWidth: 100 }}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div>
        <span className="block text-xxs uppercase tracking-wider text-muted-alt font-bold">{label}</span>
        <span className="text-xl font-bold text-brown tracking-tight">{value}</span>
      </div>
    </div>
  );
}
