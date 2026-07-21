<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Intake;

class JobCompleted extends Notification implements ShouldQueue
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
                    ->subject("Vehicle Ready for Pickup - MMG Autozone")
                    ->greeting("Hello {$notifiable->name},")
                    ->line("Great news! The repair/service for your {$this->intake->vehicle} (Ref: {$this->intake->reference_number}) has been completed.")
                    ->line("Your vehicle is now ready for pickup at our shop.")
                    ->line("If you haven't settled your balance yet, you may do so at the shop upon pickup.")
                    ->action('View Job Details', url('/receipt/' . $this->intake->reference_number))
                    ->line('Thank you for trusting MMG Autozone!');
    }
}
