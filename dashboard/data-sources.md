# مصادر البيانات في لوحة ActivityWatch

## 1. البيانات الأساسية من ActivityWatch

### أ) بيانات المضيفين (Hosts)
```json
{
  "id": "aw-watcher-window_workstation-01",
  "name": "Workstation-01", 
  "hostname": "workstation-01.local",
  "platform": "windows",
  "lastSeen": "2024-01-15T10:30:00Z",
  "isOnline": true,
  "version": "0.12.0",
  "timezone": "UTC"
}
```

### ب) بيانات النشاط (Activity Events)
```json
{
  "id": "event_123",
  "hostId": "aw-watcher-window_workstation-01",
  "timestamp": "2024-01-15T10:00:00Z",
  "duration": 300,
  "type": "app",
  "data": {
    "app": "code.exe",
    "title": "main.py - Visual Studio Code",
    "category": "productive"
  }
}
```

### ج) بيانات التطبيقات (Application Usage)
```json
{
  "name": "Visual Studio Code",
  "time": 28800,
  "category": "productive",
  "sessions": 12,
  "avgSessionDuration": 2400
}
```

## 2. نقاط النهاية المطلوبة

### أ) إدارة المضيفين
- `GET /api/hosts` - قائمة المضيفين
- `GET /api/hosts/{id}` - تفاصيل مضيف
- `PATCH /api/hosts/{id}` - تحديث مضيف

### ب) إدارة المجموعات
- `GET /api/groups` - قائمة المجموعات
- `POST /api/groups` - إنشاء مجموعة
- `PATCH /api/groups/{id}` - تحديث مجموعة

### ج) التحليلات والإحصائيات
- `GET /api/hosts/{id}/metrics` - إحصائيات مضيف
- `GET /api/groups/{id}/analytics` - تحليلات مجموعة
- `GET /api/activity/events` - أحداث النشاط

## 3. تكامل WebSocket للبيانات المباشرة

### أ) أحداث الحالة
```json
{
  "type": "host_status",
  "data": {
    "hostId": "aw-watcher-window_workstation-01",
    "isOnline": true,
    "lastActivity": "2024-01-15T10:30:00Z",
    "currentApp": "code.exe"
  }
}
```

### ب) تحديثات النشاط
```json
{
  "type": "activity_update", 
  "data": {
    "hostId": "aw-watcher-window_workstation-01",
    "activity": {
      "id": "event_124",
      "timestamp": "2024-01-15T10:31:00Z",
      "duration": 60,
      "type": "app",
      "data": {
        "app": "chrome.exe",
        "title": "GitHub - ActivityWatch"
      }
    }
  }
}
```

## 4. خوارزميات حساب الإنتاجية

### أ) تصنيف التطبيقات
```python
def categorize_application(app_name: str) -> str:
    productive_apps = ["code", "editor", "terminal", "ide"]
    neutral_apps = ["browser", "email", "documentation"]
    distracting_apps = ["game", "social", "entertainment"]
    
    app_lower = app_name.lower()
    
    if any(prod in app_lower for prod in productive_apps):
        return "productive"
    elif any(neutral in app_lower for neutral in neutral_apps):
        return "neutral"
    else:
        return "distracting"
```

### ب) حساب درجة الإنتاجية
```python
def calculate_productivity_score(productive_time: int, total_time: int) -> float:
    if total_time == 0:
        return 0.0
    
    base_score = (productive_time / total_time) * 100
    
    # تطبيق عوامل إضافية
    if total_time > 8 * 3600:  # أكثر من 8 ساعات
        base_score *= 0.9  # خصم 10% للعمل المفرط
    
    return min(100.0, max(0.0, base_score))
```

## 5. مصادر البيانات الخارجية (اختيارية)

### أ) تقويم العمل
- Google Calendar API
- Outlook Calendar API
- تقويم محلي

### ب) إدارة المشاريع
- Jira API
- Trello API
- GitHub API

### ج) التواصل
- Slack API
- Microsoft Teams API
- Discord API

## 6. التخزين المؤقت

### أ) Redis Cache
```python
# تخزين مؤقت للإحصائيات
cache.set(f"host_metrics_{host_id}_{date}", metrics, expire=3600)

# تخزين مؤقت للبيانات المجمعة
cache.set(f"group_analytics_{group_id}_{period}", analytics, expire=1800)
```

### ب) Local Storage
```javascript
// تخزين إعدادات المستخدم
localStorage.setItem('user_preferences', JSON.stringify(preferences));

// تخزين بيانات المجموعات
localStorage.setItem('host_groups', JSON.stringify(groups));
```
