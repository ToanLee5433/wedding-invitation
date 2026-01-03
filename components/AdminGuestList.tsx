
import React, { useState, useEffect, useMemo } from 'react';
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
  Sparkles,
  Calendar,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  Plus,
  Send,
  UserPlus
} from 'lucide-react';

export default function AdminGuestList() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // New Invite State
  const [newName, setNewName] = useState('');
  const [newGroup, setNewGroup] = useState('Bạn bè');
  const [isCreating, setIsCreating] = useState(false);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching guests:', error.message);
        console.error('Error details:', error);
      } else {
        console.log('Fetched guests:', data);
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
      const inviteLink = `${window.location.origin}${window.location.pathname}?to=${encodeURIComponent(encodedName)}`;

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
      alert("Đã tạo lời mời thành công!");
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khách mời này?")) return;
    const { error } = await supabase.from('guests').delete().eq('id', id);
    if (!error) setGuests(guests.filter(g => g.id !== id));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Đã sao chép link mời!");
  };

  const filteredGuests = guests.filter(g =>
    g.guest_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 space-y-4 md:space-y-6 pb-8">
      {/* Compact Row: Create Invite + Stats */}
      <div className="flex flex-col xl:flex-row gap-4">
        {/* Create New Invite Section - Compact */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <UserPlus size={16} />
            </div>
            <h2 className="text-sm font-bold text-slate-800">Tạo lời mời mới</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Nhập tên khách mời..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
            />
            <div className="flex gap-2">
              <select
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm font-medium sm:w-32"
              >
                <option>Bạn bè</option>
                <option>Đồng nghiệp</option>
                <option>Họ hàng nội</option>
                <option>Họ hàng ngoại</option>
                <option>Khách quý</option>
              </select>
              <button
                onClick={handleAddInvite}
                disabled={isCreating || !newName}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-1 shrink-0"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Tạo
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Responsive wrap */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:flex gap-3 shrink-0">
          <StatCard icon={<LinkIcon />} label="Link" value={stats.totalInvited} color="bg-slate-800" />
          <StatCard icon={<CheckCircle />} label="Phản hồi" value={stats.responses} color="bg-emerald-600" />
          <StatCard icon={<Users />} label="Khách" value={stats.totalConfirmed} color="bg-blue-600" />
          <StatCard icon={<MessageSquare />} label="Chúc" value={stats.newWishes} color="bg-amber-500" />
        </div>
      </div>

      {/* Table Section - MAIN FOCUS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
            <h3 className="text-base md:text-lg font-bold text-slate-800 shrink-0">Danh sách khách mời</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500/20 text-sm"
              />
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 px-3 py-2.5 text-slate-500 hover:text-slate-800 font-bold text-xs bg-slate-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" /> Xuất Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px] md:min-w-0">
            <thead className="bg-slate-50/50 text-[10px] uppercase tracking-widest font-bold text-slate-400">
              <tr>
                <th className="px-6 py-4">Khách mời</th>
                <th className="px-6 py-4">Nhóm</th>
                <th className="px-6 py-4 text-center">SL</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Link mời</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6} className="py-20 text-center text-slate-400">Đang tải...</td></tr>
              ) : filteredGuests.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center text-slate-300 italic">Chưa có dữ liệu</td></tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{guest.guest_name}</div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar size={10} /> {new Date(guest.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{guest.guest_group || 'Chung'}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-blue-600">{guest.guest_count || '--'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {guest.attendance_status === true ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
                          <UserCheck size={12} /> Xác nhận
                        </span>
                      ) : guest.attendance_status === false ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-bold">
                          <UserMinus size={12} /> Từ chối
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">
                          Đã gửi link
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] text-slate-300 max-w-[120px] truncate">
                          {guest.invite_link}
                        </div>
                        <button
                          onClick={() => copyToClipboard(guest.invite_link)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://zalo.me/share?url=${encodeURIComponent(guest.invite_link)}&title=${encodeURIComponent('Mời ' + guest.guest_name + ' đến dự đám cưới của chúng mình!')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5"
                        >
                          <Send size={12} /> Gửi Zalo
                        </a>
                        <button
                          onClick={() => handleDelete(guest.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 min-w-[100px]">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${color}`}>
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div>
        <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">{label}</span>
        <span className="text-2xl font-black text-slate-800 tracking-tight">{value}</span>
      </div>
    </div>
  );
}
