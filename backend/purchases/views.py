from core.views import BaseViewSet
from core.mixins import CreateSerializerMixin, PrefetchMixin
from .models import Purchase
from .serializers import PurchaseSerializer, CreatePurchaseSerializer


class PurchaseViewSet(CreateSerializerMixin, PrefetchMixin, BaseViewSet):
    """
    ViewSet para gerenciar compras.
    """
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    create_serializer_class = CreatePurchaseSerializer
    prefetch_fields = ['items__product', 'sale']
    
