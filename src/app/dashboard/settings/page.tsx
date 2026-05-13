"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, Shield, Bell, Moon, Download, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [profile, setProfile] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleDeleteData = async () => {
    if (!confirm("Are you sure you want to permanently delete all your data? This cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/data", { method: "DELETE" });
      if (res.ok) {
        alert("All your data has been deleted successfully.");
        router.refresh();
      } else {
        alert("Failed to delete data. Please try again.");
      }
    } catch (error) {
      console.error("Delete data failed", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Settings</h2>
        <p className="text-zinc-400">Manage your account preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <Button variant="outline" size="sm">Change Avatar</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <User className="w-4 h-4" /> Username
              </label>
              <Input 
                value={profile?.username || ""} 
                readOnly 
                className="text-white bg-secondary/50 cursor-not-allowed" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </label>
              <Input 
                value={profile?.email || ""} 
                readOnly 
                className="text-white bg-secondary/50 cursor-not-allowed" 
              />
            </div>
            <Button className="w-full mt-4" disabled>Save Profile (Coming Soon)</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Current Password
              </label>
              <Input type="password" placeholder="••••••••" className="text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Lock className="w-4 h-4" /> New Password
              </label>
              <Input type="password" placeholder="••••••••" className="text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Confirm Password
              </label>
              <Input type="password" placeholder="••••••••" className="text-white" />
            </div>
            <Button className="w-full mt-4" disabled>Update Password (Coming Soon)</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Daily Summary Email", desc: "Receive a daily summary of your betting activity" },
              { label: "Bet Result Alerts", desc: "Get notified when your bet results are in" },
              { label: "Profit Milestones", desc: "Celebrate when you hit profit milestones" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-zinc-400">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={i === 0} className="sr-only peer" />
                  <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3">
              <h4 className="text-sm font-medium text-white">Export Data</h4>
              <p className="text-xs text-zinc-400">Download your betting data in CSV or PDF format.</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Export CSV</Button>
                <Button variant="outline" size="sm" disabled>Export PDF</Button>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3">
              <h4 className="text-sm font-medium text-white">Import Data</h4>
              <p className="text-xs text-zinc-400">Import your betting data from a CSV file.</p>
              <Button variant="outline" size="sm" disabled>Import CSV</Button>
            </div>
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 space-y-3">
              <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
              <p className="text-xs text-zinc-400">Permanently delete all your data. This action cannot be undone.</p>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDeleteData}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete All Data"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
