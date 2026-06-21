import { DamageForm } from "../../../_components/DamageForm";

export default function EditDamagePage() {
    // ডেমো ডেটা (বাস্তবে API থেকে আসবে)
    const demoData = {
        product: "Good Foods Biscuit",
        qty: "25",
        reason: "expired",
        date: "2026-04-08",
        note: "Batch #402 was found expired during monthly audit."
    };

    return <DamageForm type="edit" initialData={demoData} />;
}