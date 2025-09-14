package com.assignment.backend.service.impl;

import com.assignment.backend.dto.AppointmentDTO;
import com.assignment.backend.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${application.name:SaloonEase}")
    private String applicationName;

    @Override
    public void sendAppointmentConfirmationEmail(AppointmentDTO appointmentDTO) {
        sendEmail(appointmentDTO, "Confirmed", "green", "Your appointment has been approved.");
    }

    @Override
    public void sendAppointmentCancellationEmail(AppointmentDTO appointmentDTO) {
        sendEmail(appointmentDTO, "Cancelled", "red", "Your appointment has been declined.");
    }

    private void sendEmail(AppointmentDTO dto, String status, String color, String message) {
        try {
            MimeMessage mailMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mailMessage, true);

            helper.setFrom(senderEmail);
            helper.setTo(dto.getUserEmail());
            helper.setSubject(applicationName + " - Appointment " + status);

            String emailContent = "<html>" +
                    "<body style='font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;'>" +
                    "<div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>" +
                    "<h2 style='color:" + color + "; text-align: center;'>Appointment " + status + "</h2>" +
                    "<p>Dear Customer,</p>" +
                    "<p>" + message + "</p>" +
                    "<table style='width: 100%; border-collapse: collapse;'>" +
                    "<tr><td style='padding: 8px; border: 1px solid #ddd;'><b>Service:</b></td><td style='padding: 8px; border: 1px solid #ddd;'>" + dto.getServiceName() + "</td></tr>" +
                    "<tr><td style='padding: 8px; border: 1px solid #ddd;'><b>Date:</b></td><td style='padding: 8px; border: 1px solid #ddd;'>" + dto.getBookingDate() + "</td></tr>" +
                    "<tr><td style='padding: 8px; border: 1px solid #ddd;'><b>Time:</b></td><td style='padding: 8px; border: 1px solid #ddd;'>" + dto.getAppointmentTime() + "</td></tr>" +
                    "<tr><td style='padding: 8px; border: 1px solid #ddd;'><b>Price:</b></td><td style='padding: 8px; border: 1px solid #ddd;'>Rs. " + dto.getPrice() + "</td></tr>" +
                    "</table>" +
                    "<p style='margin-top: 20px;'>Thank you for choosing <b>" + applicationName + "</b>!</p>" +
                    "<hr style='border: none; border-top: 1px solid #eee;'/>" +
                    "<p style='font-size: 12px; color: #888;'>Contact Us:</p>" +
                    "<p style='font-size: 12px; color: #888;'>" +
                    "📞 Phone: +94 77 123 4567<br/>" +
                    "📧 Email: info@saloonease.com<br/>" +
                    "🌐 Website: www.saloonease.com" +
                    "</p>" +
                    "<p style='font-size: 12px; color: #888;'>This is an automated message. Please do not reply.</p>" +
                    "</div>" +
                    "</body>" +
                    "</html>";



            helper.setText(emailContent, true);
            mailSender.send(mailMessage);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
    public void sendApprovalEmail(String toEmail, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            helper.setTo(toEmail);
            helper.setSubject("SaloonEase - Account Approved");

            String htmlContent = "<html><body style='font-family: Arial, sans-serif;'>" +
                    "<h2 style='color:green;'>Account Approved</h2>" +
                    "<p>Dear " + username + ",</p>" +
                    "<p>Your account has been <b>approved</b> by the admin.</p>" +
                    "<p>Thank you for choosing SaloonEase!</p>" +
                    "<hr style='border-top:1px solid #eee;'/>" +
                    "<p style='font-size:12px;color:#888;'>Contact: info@saloonease.com | +94 77 123 4567</p>" +
                    "</body></html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
