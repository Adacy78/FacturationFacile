import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Users, FileText, Euro, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';

const DashboardCard = ({ title, value, subtitle, icon: Icon, color, onPress }: any) => (
  <TouchableOpacity style={[styles.card, { borderLeftColor: color }]} onPress={onPress}>
    <View style={styles.cardHeader}>
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Icon size={24} color={color} />
      </View>
    </View>
  </TouchableOpacity>
);

const QuickAction = ({ title, icon: Icon, color, onPress }: any) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress}>
    <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
      <Icon size={20} color={color} />
    </View>
    <Text style={styles.quickActionText}>{title}</Text>
  </TouchableOpacity>
);

const RecentInvoice = ({ number, client, amount, status, date }: any) => {
  const statusColor = status === 'paid' ? '#059669' : status === 'sent' ? '#2563eb' : '#dc2626';
  const statusText = status === 'paid' ? 'Payée' : status === 'sent' ? 'Envoyée' : 'En retard';
  
  return (
    <View style={styles.invoiceItem}>
      <View style={styles.invoiceHeader}>
        <Text style={styles.invoiceNumber}>{number}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
        </View>
      </View>
      <Text style={styles.invoiceClient}>{client}</Text>
      <View style={styles.invoiceFooter}>
        <Text style={styles.invoiceAmount}>{amount}</Text>
        <Text style={styles.invoiceDate}>{date}</Text>
      </View>
    </View>
  );
};

export default function DashboardScreen() {
  const dashboardData = [
    {
      title: 'Chiffre d\'affaires',
      value: '45 230 €',
      subtitle: '+12% ce mois',
      icon: TrendingUp,
      color: '#059669',
    },
    {
      title: 'Clients actifs',
      value: '127',
      subtitle: '+8 nouveaux',
      icon: Users,
      color: '#2563eb',
    },
    {
      title: 'Factures émises',
      value: '89',
      subtitle: 'Ce mois',
      icon: FileText,
      color: '#7c3aed',
    },
    {
      title: 'À encaisser',
      value: '12 450 €',
      subtitle: '23 factures',
      icon: Euro,
      color: '#dc2626',
    },
  ];

  const quickActions = [
    { title: 'Nouvelle facture', icon: FileText, color: '#2563eb' },
    { title: 'Nouveau client', icon: Users, color: '#059669' },
    { title: 'Relances', icon: AlertCircle, color: '#dc2626' },
    { title: 'Exports', icon: CheckCircle, color: '#7c3aed' },
  ];

  const recentInvoices = [
    { number: 'FACT-2025-001', client: 'ACME Corp', amount: '1 250 €', status: 'paid', date: '15 janv.' },
    { number: 'FACT-2025-002', client: 'TechStart SAS', amount: '890 €', status: 'sent', date: '16 janv.' },
    { number: 'FACT-2025-003', client: 'Global Ltd', amount: '2 100 €', status: 'overdue', date: '12 janv.' },
    { number: 'FACT-2025-004', client: 'Innovation Inc', amount: '650 €', status: 'paid', date: '17 janv.' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Bonjour 👋</Text>
          <Text style={styles.title}>Tableau de bord</Text>
        </View>

        <View style={styles.metricsContainer}>
          {dashboardData.map((item, index) => (
            <DashboardCard key={index} {...item} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <QuickAction key={index} {...action} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Factures récentes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.invoicesContainer}>
            {recentInvoices.map((invoice, index) => (
              <RecentInvoice key={index} {...invoice} />
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  metricsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  invoicesContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  invoiceItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  invoiceClient: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  invoiceDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  bottomSpacer: {
    height: 32,
  },
});