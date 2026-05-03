from rest_framework import serializers
from .models import (
    Agency, Branch, BranchSettings, Package
)

class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = '__all__'

class AgencySerializer(serializers.ModelSerializer):
    package = PackageSerializer(read_only=True)
    days_left = serializers.SerializerMethodField()
    is_trial = serializers.SerializerMethodField()

    class Meta:
        model = Agency
        fields = [
            'id', 'name', 'subscription_status', 'had_trial_before',
            'trial_end_date', 'subscription_expiry', 'is_unlimited_usage',
            'is_onboarded', 'is_frozen', 'package', 'created_at',
            'updated_at', 'days_left', 'is_trial'
        ]

    def get_days_left(self, obj):
        from django.utils import timezone
        now = timezone.now()
        target_date = None
        
        if obj.subscription_status == 'trial':
            target_date = obj.trial_end_date
        elif obj.subscription_status == 'active':
            target_date = obj.subscription_expiry
            
        if target_date and target_date > now:
            return (target_date - now).days
        return 0

    def get_is_trial(self, obj):
        return obj.subscription_status == 'trial'

class BranchSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BranchSettings
        fields = '__all__'

class BranchSerializer(serializers.ModelSerializer):
    agency = AgencySerializer(read_only=True)
    settings = BranchSettingsSerializer(read_only=True)
    managers = serializers.SerializerMethodField()

    class Meta:
        model = Branch
        fields = '__all__'

    def get_managers(self, obj):
        from users.models import User
        # Filter for users whose PRIMARY branch is this one
        managers = User.objects.filter(primary_branch=obj).exclude(role__name__iexact='admin')
        return [{
            "id": m.id,
            "name": m.name,
            "email": m.email,
            "status": m.status
        } for m in managers]

