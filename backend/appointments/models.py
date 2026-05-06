from django.db import models
from django.utils.timezone import now
from core.utils import gen_ap_id

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('SCHEDULED', 'Scheduled'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('NO_SHOW', 'No Show'),
    )

    id = models.CharField(max_length=30, primary_key=True, default=gen_ap_id)
    title = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')
    
    customer = models.ForeignKey('customers.Customer', on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    customer_name = models.CharField(max_length=200, null=True, blank=True)
    customer_phone = models.CharField(max_length=50, null=True, blank=True)
    
    agency = models.ForeignKey('core_app.Agency', on_delete=models.CASCADE, related_name='appointments', null=True, blank=True)
    branch = models.ForeignKey('core_app.Branch', on_delete=models.CASCADE, related_name='appointments', null=True, blank=True)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='appointments_created', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Appointments"
        ordering = ['start_time']

    def __str__(self):
        return f"{self.title} - {self.start_time}"
