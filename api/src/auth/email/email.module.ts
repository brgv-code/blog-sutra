import { Module } from "@nestjs/common";
import { MailerModule, MailerOptions } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EmailService } from "./email.service";
import { google } from "googleapis";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService): Promise<MailerOptions> => {
        const provider = (
          cfg.get<string>("EMAIL_PROVIDER") || "SMTP"
        ).toUpperCase();

        if (provider === "GMAIL") {
          const user = cfg.get<string>("GMAIL_USER")?.trim();
          const clientId = cfg.get<string>("GMAIL_CLIENT_ID")?.trim();
          const clientSecret = cfg.get<string>("GMAIL_CLIENT_SECRET")?.trim();
          const refreshToken = cfg.get<string>("GMAIL_REFRESH_TOKEN")?.trim();
          console.log({
            user: cfg.get("GMAIL_USER"),
            clientId: cfg.get("GMAIL_CLIENT_ID"),
            clientSecret: cfg.get("GMAIL_CLIENT_SECRET"),
            refreshToken: cfg.get("GMAIL_REFRESH_TOKEN"),
          });

          if (!user || !clientId || !clientSecret || !refreshToken) {
            throw new Error(
              "Gmail OAuth2 is selected but required env vars are missing"
            );
          }

          let accessToken = cfg.get("GMAIL_ACCESS_TOKEN");
          if (!accessToken) {
            const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
            oauth2.setCredentials({ refresh_token: refreshToken });
            const { token } = await oauth2.getAccessToken();
            accessToken = token || undefined;
          }
          return {
            transport: {
              service: "gmail",
              pool: true,
              maxConnections: 5,
              maxMessages: 100,
              auth: {
                type: "OAuth2",
                user,
                clientId,
                clientSecret,
                refreshToken,
                accessToken,
              },
              connectionTimeout: 5000,
              greetingTimeout: 5000,
              socketTimeout: 10000,
            },
            defaults: { from: cfg.get<string>("FROM") || user },
          };
        }

        return {
          transport: {
            host: cfg.get<string>("SMTP_HOST"),
            port: Number(cfg.get<string>("SMTP_PORT") || 587),
            secure:
              String(
                cfg.get<string>("SMTP_SECURE") || "false"
              ).toLowerCase() === "true",
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
            auth: {
              user: cfg.get<string>("SMTP_USER"),
              pass: cfg.get<string>("SMTP_PASS"),
            },
            tls: { rejectUnauthorized: false },
            connectionTimeout: 5000,
            greetingTimeout: 5000,
            socketTimeout: 10000,
          },
          defaults: {
            from: cfg.get<string>("FROM") || cfg.get<string>("SMTP_USER"),
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
