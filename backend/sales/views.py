from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from core.mixins import CreateSerializerMixin, PrefetchMixin
from .models import Sale
from .serializers import SaleSerializer, CreateSaleSerializer, SaleWithPurchasesSerializer, SaleStatusSerializer


class SaleViewSet(CreateSerializerMixin, PrefetchMixin, ModelViewSet):
    """ViewSet para gerenciar vendas."""
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
        """Retorna uma venda com todas as compras relacionadas."""
        sale = self.get_object()
        serializer = SaleWithPurchasesSerializer(sale)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def with_status(self, request):
        """Retorna todas as vendas com seus status de compra."""
        sales = self.get_queryset()
        serializer = SaleStatusSerializer(sales, many=True)
        return Response(serializer.data)
