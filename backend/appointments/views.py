from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Appointment
from .serializers import AppointmentSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['branch', 'status', 'customer']
    search_fields = ['title', 'description', 'customer_name']
    ordering_fields = ['start_time', 'created_at']

    def get_queryset(self):
        user = self.request.user
        agency_id = getattr(user, 'agency_id', None)
        
        if user.is_superuser:
            qs = super().get_queryset()
        else:
            qs = super().get_queryset().filter(agency_id=agency_id)
            
        branch_id = self.request.query_params.get('branchId')
        if branch_id:
            qs = qs.filter(branch_id=branch_id)
            
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        agency_id = getattr(user, 'agency_id', None)
        branch_id = self.request.data.get('branch') or self.request.query_params.get('branchId') or getattr(user, 'branch_id', None)
        
        serializer.save(
            user=user,
            agency_id=agency_id,
            branch_id=branch_id
        )
