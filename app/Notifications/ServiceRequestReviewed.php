<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\ServiceRequest;

class ServiceRequestReviewed extends Notification implements ShouldQueue
{
    use Queueable;

    public $serviceRequest;
    public $pdfData;

    /**
     * Create a new notification instance.
     */
    public function __construct(ServiceRequest $serviceRequest, $pdfData = null)
    {
        $this->serviceRequest = $serviceRequest;
        $this->pdfData = $pdfData;
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
        $status = $this->serviceRequest->status;
        $type = str_replace('_', ' ', $this->serviceRequest->service_type);
        $cost = number_format($this->serviceRequest->estimated_cost, 2);

        $name = $this->serviceRequest->name ?? optional($this->serviceRequest->user)->name ?? 'Customer';

        $mail = (new MailMessage)
                    ->subject("Your $type Request at MMG Autozone - $status")
                    ->greeting("Hello {$name},")
                    ->line("Your $type request for your {$this->serviceRequest->vehicle_model} has been reviewed.")
                    ->line("Status: **$status**");

        if ($this->serviceRequest->estimated_cost) {
            $mail->line("Estimated Cost: **Php $cost**");
        }

        if ($this->serviceRequest->admin_remarks) {
            $mail->line("Shop Remarks: " . $this->serviceRequest->admin_remarks);
        }

        if ($status === 'Approved') {
            $mail->line("You may now proceed to drop off your vehicle at our shop.");
        }

        $mail->action('View Request Details', url('/home'));
        
        $mail->line('Thank you for choosing MMG Autozone!');

        if ($this->pdfData) {
            $mail->attachData($this->pdfData, 'Quotation.pdf', [
                'mime' => 'application/pdf',
            ]);
        }

        return $mail;
    }
}
