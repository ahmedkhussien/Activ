# مثال على تكامل Backend مع ActivityWatch
# هذا ملف مثال يوضح كيفية إنشاء API endpoints

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime, timedelta
import asyncio

app = FastAPI(title="ActivityWatch Dashboard API")

# إعداد CORS للسماح للوحة بالوصول للبيانات
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # عنوان اللوحة
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ربط مع ActivityWatch Client
from aw_client import ActivityWatchClient

aw_client = ActivityWatchClient("localhost", 5600)

@app.get("/api/hosts")
async def get_hosts():
    """الحصول على قائمة المضيفين من ActivityWatch"""
    try:
        # الحصول على معلومات المضيفين
        hosts = []
        
        # مثال: الحصول على البيانات من ActivityWatch
        buckets = await aw_client.get_buckets()
        
        for bucket_id, bucket in buckets.items():
            if bucket.type == "currentwindow":  # نوافذ التطبيقات
                host_info = {
                    "id": bucket_id,
                    "name": bucket.hostname,
                    "hostname": bucket.hostname,
                    "platform": bucket.hostname.split("-")[0] if "-" in bucket.hostname else "unknown",
                    "lastSeen": bucket.last_updated.isoformat(),
                    "isOnline": True,  # يمكن تحديد هذا بناءً على آخر نشاط
                    "version": "0.12.0",
                    "timezone": "UTC"
                }
                hosts.append(host_info)
        
        return {"data": hosts, "success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/hosts/{host_id}/metrics")
async def get_host_metrics(host_id: str, start: str, end: str):
    """الحصول على إحصائيات مضيف محدد"""
    try:
        start_time = datetime.fromisoformat(start.replace('Z', '+00:00'))
        end_time = datetime.fromisoformat(end.replace('Z', '+00:00'))
        
        # الحصول على بيانات النشاط
        events = await aw_client.get_events(
            bucket_id=host_id,
            start=start_time,
            end=end_time
        )
        
        # حساب الإحصائيات
        total_time = 0
        productive_time = 0
        neutral_time = 0
        distracting_time = 0
        
        for event in events:
            duration = event.duration.total_seconds()
            total_time += duration
            
            # تصنيف النشاط بناءً على التطبيق
            app_name = event.data.get("app", "").lower()
            if any(prod in app_name for prod in ["code", "editor", "terminal"]):
                productive_time += duration
            elif any(neutral in app_name for neutral in ["browser", "email"]):
                neutral_time += duration
            else:
                distracting_time += duration
        
        # حساب درجة الإنتاجية
        productivity_score = (productive_time / total_time * 100) if total_time > 0 else 0
        
        metrics = {
            "hostId": host_id,
            "period": f"{start} to {end}",
            "totalTime": total_time,
            "activeTime": total_time,
            "idleTime": 0,
            "productiveTime": productive_time,
            "neutralTime": neutral_time,
            "distractingTime": distracting_time,
            "afkTime": 0,
            "workingHours": 8 * 3600,  # 8 ساعات عمل
            "overtime": max(0, total_time - 8 * 3600),
            "productivityScore": productivity_score,
            "applications": [],  # يمكن إضافة تفاصيل التطبيقات
            "websites": [],
            "activityHeatmap": [],
            "peakHours": [],
            "downtimeEvents": []
        }
        
        return {"data": metrics, "success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/activity/events")
async def get_activity_events(
    host_id: Optional[str] = None,
    start: Optional[str] = None,
    end: Optional[str] = None,
    page: int = 1,
    limit: int = 100
):
    """الحصول على أحداث النشاط"""
    try:
        # تحديد نطاق الوقت
        if not start:
            start = (datetime.now() - timedelta(days=7)).isoformat()
        if not end:
            end = datetime.now().isoformat()
            
        start_time = datetime.fromisoformat(start.replace('Z', '+00:00'))
        end_time = datetime.fromisoformat(end.replace('Z', '+00:00'))
        
        events = []
        
        if host_id:
            # أحداث مضيف محدد
            bucket_events = await aw_client.get_events(
                bucket_id=host_id,
                start=start_time,
                end=end_time
            )
            
            for event in bucket_events:
                events.append({
                    "id": str(event.id),
                    "hostId": host_id,
                    "timestamp": event.timestamp.isoformat(),
                    "duration": event.duration.total_seconds(),
                    "type": "app",
                    "data": {
                        "app": event.data.get("app", ""),
                        "title": event.data.get("title", ""),
                        "category": "productive"  # يمكن تحسين التصنيف
                    }
                })
        else:
            # جميع الأحداث من جميع المضيفين
            buckets = await aw_client.get_buckets()
            for bucket_id, bucket in buckets.items():
                if bucket.type == "currentwindow":
                    bucket_events = await aw_client.get_events(
                        bucket_id=bucket_id,
                        start=start_time,
                        end=end_time
                    )
                    
                    for event in bucket_events:
                        events.append({
                            "id": str(event.id),
                            "hostId": bucket_id,
                            "timestamp": event.timestamp.isoformat(),
                            "duration": event.duration.total_seconds(),
                            "type": "app",
                            "data": {
                                "app": event.data.get("app", ""),
                                "title": event.data.get("title", ""),
                                "category": "productive"
                            }
                        })
        
        # تطبيق الصفحات
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_events = events[start_idx:end_idx]
        
        return {
            "data": paginated_events,
            "success": True,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": len(events),
                "totalPages": (len(events) + limit - 1) // limit
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5601)
