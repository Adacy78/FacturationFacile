import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, Building2, Phone, Mail, X } from 'lucide-react-native';

const ClientCard = ({ client, onPress }: any) => (
  <TouchableOpacity style={styles.clientCard} onPress={onPress}>
    <View style={styles.clientHeader}>
      <View style={styles.clientIcon}>
        <Building2 size={20} color="#2563eb" />
      </View>
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{client.name}</Text>
        <Text style={styles.clientSiren}>SIREN: {client.siren}</Text>
      </View>
      <View style={styles.clientStats}>
        <Text style={styles.clientAmount}>{client.totalAmount}</Text>
        <Text style={styles.clientInvoices}>{client.invoiceCount} factures</Text>
      </View>
    </View>
    <View style={styles.clientDetails}>
      <View style={styles.clientContact}>
        <Phone size={14} color="#6b7280" />
        <Text style={styles.contactText}>{client.phone}</Text>
      </View>
      <View style={styles.clientContact}>
        <Mail size={14} color="#6b7280" />
        <Text style={styles.contactText}>{client.email}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const AddClientModal = ({ visible, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    siren: '',
    vatNumber: '',
    email: '',
    phone: '',
    billingAddress: '',
    deliveryAddress: '',
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
    setFormData({
      name: '',
      siren: '',
      vatNumber: '',
      email: '',
      phone: '',
      billingAddress: '',
      deliveryAddress: '',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Nouveau client</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informations générales</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom de la société *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                placeholder="Ex: ACME Corporation"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SIREN *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.siren}
                onChangeText={(text) => setFormData({...formData, siren: text})}
                placeholder="123 456 789"
                maxLength={11}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>N° TVA intracommunautaire</Text>
              <TextInput
                style={styles.textInput}
                value={formData.vatNumber}
                onChangeText={(text) => setFormData({...formData, vatNumber: text})}
                placeholder="FR 12 123456789"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Contact</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                placeholder="contact@acme.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Téléphone</Text>
              <TextInput
                style={styles.textInput}
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
                placeholder="+33 1 23 45 67 89"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Adresses</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Adresse de facturation *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.billingAddress}
                onChangeText={(text) => setFormData({...formData, billingAddress: text})}
                placeholder="123 Rue de la Paix&#10;75001 Paris"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Adresse de livraison</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.deliveryAddress}
                onChangeText={(text) => setFormData({...formData, deliveryAddress: text})}
                placeholder="Laisser vide si identique à l'adresse de facturation"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default function ClientsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'ACME Corporation',
      siren: '123 456 789',
      phone: '+33 1 23 45 67 89',
      email: 'contact@acme.com',
      totalAmount: '12 450 €',
      invoiceCount: 15,
    },
    {
      id: 2,
      name: 'TechStart SAS',
      siren: '987 654 321',
      phone: '+33 1 98 76 54 32',
      email: 'hello@techstart.fr',
      totalAmount: '8 900 €',
      invoiceCount: 8,
    },
    {
      id: 3,
      name: 'Global Trading Ltd',
      siren: '456 789 123',
      phone: '+33 1 45 67 89 01',
      email: 'orders@global-trading.com',
      totalAmount: '25 200 €',
      invoiceCount: 23,
    },
    {
      id: 4,
      name: 'Innovation Inc',
      siren: '789 123 456',
      phone: '+33 1 78 91 23 45',
      email: 'info@innovation.co',
      totalAmount: '5 670 €',
      invoiceCount: 6,
    },
  ]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.siren.includes(searchQuery)
  );

  const handleAddClient = (newClient: any) => {
    const client = {
      ...newClient,
      id: clients.length + 1,
      totalAmount: '0 €',
      invoiceCount: 0,
    };
    setClients([...clients, client]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clients</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un client..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.clientsList}>
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onPress={() => console.log('Client selected:', client.name)}
            />
          ))}
        </View>

        {filteredClients.length === 0 && (
          <View style={styles.emptyState}>
            <Building2 size={48} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Aucun client trouvé</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Essayez un autre terme de recherche' : 'Commencez par ajouter votre premier client'}
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <AddClientModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddClient}
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
    backgroundColor: '#2563eb',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
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
  clientsList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  clientCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  clientSiren: {
    fontSize: 12,
    color: '#6b7280',
  },
  clientStats: {
    alignItems: 'flex-end',
  },
  clientAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 2,
  },
  clientInvoices: {
    fontSize: 12,
    color: '#6b7280',
  },
  clientDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  clientContact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 12,
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
    backgroundColor: '#2563eb',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});