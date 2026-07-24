<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Intake;

class IntakeCreated extends Notification implements ShouldQueue
{
    use Queueable;

    public $intake;
    public function __construct(Intake $intake)
    {
        $this->intake = $intake;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $name = $this->intake->customer ?? 'Customer';

        $mail = (new MailMessage)
                    ->subject("Job Order / Receipt - {$this->intake->reference_number} at MMG Autozone")
                    ->greeting("Hello {$name},")
                    ->line("Your vehicle ({$this->intake->vehicle}) has been successfully received at MMG Autozone.")
                    ->line("Reference Number: **{$this->intake->reference_number}**")
                    ->line("We have attached a digital copy of your Job Order / Receipt to this email for your records.")
                    ->action('View Receipt Online', url('/success/' . $this->intake->reference_number))
                    ->line('Our team will keep you updated on the progress of your vehicle.')
                    ->line('Thank you for trusting MMG Autozone!');

        $pdfData = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.receipt', [
            'intake' => $this->intake
        ])->output();

        $mail->attachData($pdfData, 'Job_Order_' . $this->intake->reference_number . '.pdf', [
            'mime' => 'application/pdf',
        ]);

        return $mail;
    }
}
