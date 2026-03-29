"use client";

import { MailCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { LogistixSettings } from "../logistix-demo.types";

type SettingsFormProps = {
  settings: LogistixSettings;
  onUpdate: <K extends keyof LogistixSettings>(
    field: K,
    value: LogistixSettings[K]
  ) => void;
  onSyncInbox: () => void;
};

export function SettingsForm({
  settings,
  onUpdate,
  onSyncInbox,
}: SettingsFormProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <Card className="border-border/70 bg-card/76 shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-[1.4rem] border border-border/70 bg-background/78 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">Gmail intake</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pull unread billing attachments into mocked AI extraction.
                </p>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                {settings.gmailConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant={settings.gmailConnected ? "default" : "outline"}
                onClick={() =>
                  onUpdate("gmailConnected", !settings.gmailConnected)
                }
              >
                <MailCheck data-icon="inline-start" />
                {settings.gmailConnected ? "Disconnect Gmail" : "Connect Gmail"}
              </Button>
              <Button variant="outline" onClick={onSyncInbox}>
                <Sparkles data-icon="inline-start" />
                Import latest emails
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/76 shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">Billing defaults</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="accountant-email">Accountant email</Label>
            <Input
              id="accountant-email"
              value={settings.accountantEmail}
              onChange={(event) =>
                onUpdate("accountantEmail", event.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-name">Template name</Label>
            <Input
              id="template-name"
              value={settings.templateName}
              onChange={(event) => onUpdate("templateName", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="default-margin">Default margin %</Label>
            <Input
              id="default-margin"
              type="number"
              value={settings.defaultMargin}
              onChange={(event) =>
                onUpdate("defaultMargin", Number(event.target.value) || 0)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender-company">Sender company</Label>
            <Input
              id="sender-company"
              value={settings.senderCompany}
              onChange={(event) =>
                onUpdate("senderCompany", event.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reply-to">Reply-to address</Label>
            <Input
              id="reply-to"
              value={settings.replyTo}
              onChange={(event) => onUpdate("replyTo", event.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
