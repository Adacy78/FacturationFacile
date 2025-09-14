import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, FileText, Eye, Download, CreditCard, X, Calendar, Check } from 'lucide-react-native';

const InvoiceCard = ({ invoice, onPress, onPay, onView, onDownload }: any) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#059669';
      case 'sent': return '#2563eb';
      case 'draft': return '#6b7280';
      case 'overdue': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'sent': return 'Envoyée';
      case 'draft': return 'Brouillon';
      case 'overdue': return 'En retard';
      default: return 'Inconnu';
    }
  };

  const statusColor = getStatusColor(invoice.status);

  return (
    <TouchableOpacity style={styles.invoiceCard} onPress={onPress}>
      <View style={styles.invoiceHeader}>
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceNumber}>{invoice.number}</Text>
          <Text style={styles.invoiceClient}>{invoice.client}</Text>
          <Text style={styles.invoiceDate}>{invoice.issueDate}</Text>
        </View>
        <View style={styles.invoiceRight}>
          <Text style={styles.invoiceAmount}>{invoice.totalTTC}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getStatusText(invoice.status)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.invoiceActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onView}>
          <Eye size={16} color="#6b7280" />
          <Text style={styles.actionText}>Voir</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onDownload}>
          <Download size={16} color="#6b7280" />
          <Text style={styles.actionText}>PDF</Text>
        </TouchableOpacity>

        {invoice.status === 'sent' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.payButton]} 
            onPress={onPay}
          >
            <CreditCard size={16} color="#2563eb" />
            <Text style={[styles.actionText, { color: '#2563eb' }]}>Payer</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const CreateInvoiceModal = ({ visible, onClose, onSave, clients, products }: any) => {
  const [formData, setFormData] = useState({
    clientId: '',
    type: 'invoice', // invoice, quote, credit_note
    dueDate: '',
    lines: [{ productId: '', quantity: 1, unitPrice: 0, description: '' }],
  });

  const handleAddLine = () => {
    setFormData({
      ...formData,
      lines: [...formData.lines, { productId: '', quantity: 1, unitPrice: 0, description: '' }],
    });
  };

  const handleRemoveLine = (index: number) => {
    const newLines = formData.lines.filter((_, i) => i !== index);
    setFormData({ ...formData, lines: newLines });
  };

  const calculateTotal = () => {
    return formData.lines.reduce((sum, line) => sum + (line.quantity * line.unitPrice), 0);
  };

  const handleSave = () => {
    if (!formData.clientId) {
      Alert.alert('Erreur', 'Veuillez sélectionner un client');
      return;
    }
    
    onSave(formData);
    onClose();
    setFormData({
      clientId: '',
      type: 'invoice',
      dueDate: '',
      lines: [{ productId: '', quantity: 1, unitPrice: 0, description: '' }],
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Nouvelle facture</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Créer</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informations générales</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Client *</Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerValue}>
                  {formData.clientId ? 
                    clients.find((c: any) => c.id.toString() === formData.clientId)?.name || 'Sélectionner un client' 
                    : 'Sélectionner un client'
                  }
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Type de document</Text>
              <View style={styles.documentTypeContainer}>
                {[
                  { key: 'quote', label: 'Devis' },
                  { key: 'invoice', label: 'Facture' },
                  { key: 'credit_note', label: 'Avoir' },
                ].map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.documentTypeButton,
                      formData.type === type.key && styles.documentTypeButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, type: type.key })}
                  >
                    <Text
                      style={[
                        styles.documentTypeText,
                        formData.type === type.key && styles.documentTypeTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date d'échéance</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Calendar size={16} color="#6b7280" />
                <Text style={styles.dateText}>
                  {formData.dueDate || 'Sélectionner une date'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Lignes de facturation</Text>
              <TouchableOpacity onPress={handleAddLine} style={styles.addLineButton}>
                <Plus size={16} color="#2563eb" />
                <Text style={styles.addLineText}>Ajouter</Text>
              </TouchableOpacity>
            </View>

            {formData.lines.map((line, index) => (
              <View key={index} style={styles.invoiceLine}>
                <View style={styles.lineHeader}>
                  <Text style={styles.lineNumber}>Ligne {index + 1}</Text>
                  {formData.lines.length > 1 && (
                    <TouchableOpacity 
                      onPress={() => handleRemoveLine(index)}
                      style={styles.removeLineButton}
                    >
                      <X size={16} color="#dc2626" />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={styles.textInput}
                    value={line.description}
                    onChangeText={(text) => {
                      const newLines = [...formData.lines];
                      newLines[index].description = text;
                      setFormData({ ...formData, lines: newLines });
                    }}
                    placeholder="Description du produit/service"
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Quantité</Text>
                    <TextInput
                      style={styles.textInput}
                      value={line.quantity.toString()}
                      onChangeText={(text) => {
                        const newLines = [...formData.lines];
                        newLines[index].quantity = parseFloat(text) || 0;
                        setFormData({ ...formData, lines: newLines });
                      }}
                      keyboardType="decimal-pad"
                      placeholder="1"
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Prix unitaire HT</Text>
                    <TextInput
                      style={styles.textInput}
                      value={line.unitPrice.toString()}
                      onChangeText={(text) => {
                        const newLines = [...formData.lines];
                        newLines[index].unitPrice = parseFloat(text) || 0;
                        setFormData({ ...formData, lines: newLines });
                      }}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                    />
                  </View>
                </View>

                <View style={styles.lineTotal}>
                  <Text style={styles.lineTotalText}>
                    Total ligne: {(line.quantity * line.unitPrice).toFixed(2)} € HT
                  </Text>
                </View>
              </View>
            ))}

            <View style={styles.invoiceTotal}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total HT:</Text>
                <Text style={styles.totalValue}>{calculateTotal().toFixed(2)} €</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TVA (20%):</Text>
                <Text style={styles.totalValue}>{(calculateTotal() * 0.2).toFixed(2)} €</Text>
              </View>
              <View style={[styles.totalRow, styles.totalFinal]}>
                <Text style={styles.totalLabelFinal}>Total TTC:</Text>
                <Text style={styles.totalValueFinal}>{(calculateTotal() * 1.2).toFixed(2)} €</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default function InvoicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      number: 'FACT-2025-001',
      client: 'ACME Corporation',
      issueDate: '15 janv. 2025',
      dueDate: '15 févr. 2025',
      status: 'paid',
      totalHT: 1041.67,
      totalTTC: '1 250.00 €',
    },
    {
      id: 2,
      number: 'FACT-2025-002',
      client: 'TechStart SAS',
      issueDate: '16 janv. 2025',
      dueDate: '16 févr. 2025',
      status: 'sent',
      totalHT: 741.67,
      totalTTC: '890.00 €',
    },
    {
      id: 3,
      number: 'FACT-2025-003',
      client: 'Global Trading Ltd',
      issueDate: '12 janv. 2025',
      dueDate: '12 févr. 2025',
      status: 'overdue',
      totalHT: 1750.00,
      totalTTC: '2 100.00 €',
    },
    {
      id: 4,
      number: 'DEVI-2025-001',
      client: 'Innovation Inc',
      issueDate: '17 janv. 2025',
      dueDate: '17 févr. 2025',
      status: 'draft',
      totalHT: 541.67,
      totalTTC: '650.00 €',
    },
  ]);

  const clients = [
    { id: 1, name: 'ACME Corporation' },
    { id: 2, name: 'TechStart SAS' },
    { id: 3, name: 'Global Trading Ltd' },
    { id: 4, name: 'Innovation Inc' },
  ];

  const products = [
    { id: 1, name: 'Consultation développement web', priceHT: 120 },
    { id: 2, name: 'Formation React Native', priceHT: 1200 },
    { id: 3, name: 'Développement application mobile', priceHT: 800 },
  ];

  const filteredInvoices = invoices.filter(invoice =>
    invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateInvoice = (newInvoice: any) => {
    const client = clients.find(c => c.id.toString() === newInvoice.clientId);
    const totalHT = newInvoice.lines.reduce((sum: number, line: any) => sum + (line.quantity * line.unitPrice), 0);
    
    const invoice = {
      id: invoices.length + 1,
      number: `${newInvoice.type === 'quote' ? 'DEVI' : 'FACT'}-2025-${String(invoices.length + 1).padStart(3, '0')}`,
      client: client?.name || 'Client inconnu',
      issueDate: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      dueDate: newInvoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'draft',
      totalHT,
      totalTTC: `${(totalHT * 1.2).toFixed(2)} €`,
    };
    
    setInvoices([invoice, ...invoices]);
  };

  const handlePayInvoice = (invoice: any) => {
    Alert.alert(
      'Paiement',
      `Initier le paiement de la facture ${invoice.number} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Payer', 
          onPress: () => {
            // Ici on intégrerait Stripe PaymentSheet
            Alert.alert('Paiement', 'Redirection vers le système de paiement...');
          }
        },
      ]
    );
  };

  const handleViewInvoice = (invoice: any) => {
    Alert.alert('Visualisation', `Affichage de la facture ${invoice.number}`);
  };

  const handleDownloadInvoice = (invoice: any) => {
    Alert.alert('Téléchargement', `Téléchargement PDF de ${invoice.number}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Factures</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une facture..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.invoicesList}>
          {filteredInvoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              onPress={() => console.log('Invoice selected:', invoice.number)}
              onPay={() => handlePayInvoice(invoice)}
              onView={() => handleViewInvoice(invoice)}
              onDownload={() => handleDownloadInvoice(invoice)}
            />
          ))}
        </View>

        {filteredInvoices.length === 0 && (
          <View style={styles.emptyState}>
            <FileText size={48} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Aucune facture trouvée</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Essayez un autre terme de recherche' : 'Commencez par créer votre première facture'}
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <CreateInvoiceModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateInvoice}
        clients={clients}
        products={products}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#059669',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  invoicesList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  invoiceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  invoiceClient: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  invoiceDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  invoiceRight: {
    alignItems: 'flex-end',
  },
  invoiceAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  invoiceActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  payButton: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  formSection: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  pickerContainer: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  pickerValue: {
    fontSize: 16,
    color: '#111827',
  },
  documentTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  documentTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  documentTypeButtonActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  documentTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  documentTypeTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  addLineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  addLineText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  invoiceLine: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  lineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lineNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  removeLineButton: {
    padding: 4,
  },
  lineTotal: {
    alignItems: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  lineTotalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  invoiceTotal: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalFinal: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  totalLabelFinal: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
  },
  totalValueFinal: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '700',
  },
});