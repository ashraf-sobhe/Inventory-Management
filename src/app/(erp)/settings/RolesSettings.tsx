export default function RolesSettings() {
  const roles = [
    {
      name:  'Admin — مدير',
      badge: 'badge-red',
      permissions: [
        'عرض كل البيانات',
        'إضافة وتعديل وحذف المنتجات',
        'إضافة وحذف المبيعات والمشتريات',
        'إدارة المستخدمين',
        'تعديل إعدادات النظام',
      ],
    },
    {
      name:  'Manager — مشرف',
      badge: 'badge-blue',
      permissions: [
        'عرض كل البيانات',
        'إضافة وتعديل المنتجات',
        'إضافة المبيعات والمشتريات',
        'لا يمكنه حذف البيانات',
        'لا يمكنه إدارة المستخدمين',
      ],
    },
    {
      name:  'Employee — موظف',
      badge: 'badge-green',
      permissions: [
        'عرض المنتجات فقط',
        'إضافة مبيعات فقط',
        'لا يمكنه الحذف أو التعديل',
        'لا يمكنه الوصول للإعدادات',
      ],
    },
  ]

  return (
    <div className="max-w-2xl space-y-4">
      {roles.map((role) => (
        <div key={role.name} className="card space-y-3">
          <div className="flex items-center gap-3">
            <span className={role.badge}>{role.name}</span>
          </div>
          <ul className="space-y-2">
            {role.permissions.map((perm) => (
              <li key={perm} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                {perm}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="text-xs text-gray-400 text-center">
        الصلاحيات محكومة من Supabase Row Level Security
      </p>
    </div>
  )
}