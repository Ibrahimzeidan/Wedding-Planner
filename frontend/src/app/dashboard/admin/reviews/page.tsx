import AdminLayout from "@/components/admin/AdminLayout";
import AdminReviewsPanel from "@/components/reviews/AdminReviewsPanel";

export default function AdminReviewsPage() {
  return (
    <AdminLayout title="Reviews" description="View and remove inappropriate provider reviews.">
      <AdminReviewsPanel />
    </AdminLayout>
  );
}
