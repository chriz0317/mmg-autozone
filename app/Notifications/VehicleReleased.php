<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Intake;

class VehicleReleased extends Notification implements ShouldQueue
{
    use Queueable;

    public $intake;

    /**
     * Create a new notification instance.
     */
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
        return (new MailMessage)
                    ->subject("Vehicle Released - MMG Autozone")
                    ->greeting("Hello {$this->intake->customer},")
                    ->line("This email is to confirm that your {$this->intake->vehicle} (Ref: {$this->intake->reference_number}) has been officially released from our shop.")
                    ->line("Thank you for choosing us for your vehicle's service.")
                    ->line("We hope to see you again for your future maintenance needs!")
                    ->action('View Job Summary', url('/receipt/' . $this->intake->reference_number))
                    ->line('Safe travels from MMG Autozone!');
    }
}
