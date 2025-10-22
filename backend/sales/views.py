from rest_framework.decorators import action
from rest_framework.response import Response
from core.views import BaseViewSet
from core.mixins import CreateSerializerMixin, PrefetchMixin
from .models import Sale
from .serializers import SaleSerializer, CreateSaleSerializer, SaleWithPurchasesSerializer, SaleStatusSerializer


class SaleViewSet(CreateSerializerMixin, PrefetchMixin, BaseViewSet):
    """
    ViewSet para gerenciar vendas.
    """
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    create_serializer_class = CreateSaleSerializer
    custom_serializers = {
        'with_purchases': SaleWithPurchasesSerializer,
        'status': SaleStatusSerializer
    }
    prefetch_fields = ['items__product', 'purchases__items__product']
    
    @action(detail=True, methods=['get'])
    def with_purchases(self, request, pk=None):
        """
        Retorna uma venda com todas as compras relacionadas.
        
        Endpoint: /api/sales/{id}/with_purchases/
        """
        sale = self.get_object()
        serializer = SaleWithPurchasesSerializer(sale)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        """
        Retorna o status completo de compras de uma venda.
        
        Endpoint: /api/sales/{id}/status/
        """
        sale = self.get_object()
        serializer = SaleStatusSerializer(sale)
        return Response(serializer.data)
