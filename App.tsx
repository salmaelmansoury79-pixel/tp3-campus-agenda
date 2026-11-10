import React from 'react';
import { View , Text , StyleSheet , FlatList } from 'react-native';

// structure typescripte d'un evenement
type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};
// 6 data of campus
const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];
// fonction utilitair de calcul
function PlacesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}
function StatuEvenement(e: Evenement): 'complet' | 'presque complet' | 'ouvert' {
  const r = PlacesRestantes(e);
  if (r === 0) return 'complet';
  if (r <= 3) return 'presque complet';
  return 'ouvert';
}
// composant d'affichage d'un evenement:badgeetat
type BadgeProps = { statut: 'complet' | 'presque complet' | 'ouvert' };
function BadgeEtat({ statut }: BadgeProps) {
  let styleBadge = styles.badgeOuvert;
  if (statut === 'complet') styleBadge = styles.badgeComplet;
  else if (statut === 'presque complet') styleBadge = styles.badgePresqueComplet;
  return (
    <View style={[styles.badge, styleBadge]}>
      <Text style={styles.texteBadge}>{statut}</Text>
    </View>
  );
}
// blocstatistiqu
type StatProps = { label: string; valeur: number | string };

function BlocStatistique({ label, valeur }: StatProps) {
  return (
    <View style={styles.blocStat}>
      <Text style={styles.valeurStat}>{valeur}</Text>
      <Text style={styles.labelStat}>{label}</Text>
    </View>
  );
}
// carte evenement
type CarteProps = { evenement: Evenement };

function CarteEvenement({ evenement }: CarteProps) {
  const r = PlacesRestantes(evenement);
  const statut = StatuEvenement(evenement);

  return (
    <View style={styles.carte}>
      <View style={styles.enteteCarte}>
        <Text style={styles.titreCarte}>{evenement.titre}</Text>
        <BadgeEtat statut={statut} />
      </View>
      <Text style={styles.infoCarte}>Catégorie : {evenement.categorie}</Text>
      <Text style={styles.infoCarte}>
        {r === 0 ? 'Aucune place disponible' : `${r} place${r > 1 ? 's' : ''} restante${r > 1 ? 's' : ''}`}
      </Text>
    </View>
  );
}
// composant principal
export default function App() {
  // Constante de mode d'affichage ('tous' ou 'ateliers')
  const mode: 'tous' | 'ateliers' = 'tous';

  // Calculs statistiques automatique
  const totalEvenements = evenements.length;
  const complets = evenements.filter(e => PlacesRestantes(e) === 0).length;
  const avecPlaces = evenements.filter(e => PlacesRestantes(e) > 0).length;
  const totalPlacesLibres = evenements.reduce((somme, e) => somme + PlacesRestantes(e), 0);

  // Fltrage selon le mod
  const listeAffichee = mode === 'tous'
    ? evenements
    : evenements.filter(e => e.categorie === 'Atelier' && PlacesRestantes(e) > 0);

  return (
    <View style={styles.conteneurPage}>
      <Text style={styles.titrePrincipal}>CampusAgenda</Text>
      <Text style={styles.sousTitre}>Événements du campus - IAIL S5</Text>

      {/* Range des 4 blocs statistiques */}
      <View style={styles.rangeeStats}>
        <BlocStatistique label="Total" valeur={totalEvenements} />
        <BlocStatistique label="Complets" valeur={complets} />
        <BlocStatistique label="Disponibles" valeur={avecPlaces} />
        <BlocStatistique label="Places libres" valeur={totalPlacesLibres} />
      </View>

      <Text style={styles.titreSection}>
        {mode === 'tous' ? 'Tous les événements' : 'Ateliers disponibles'}
      </Text>

      {/* Rendu dynamique performant avec FlatList */}
      <FlatList
        data={listeAffichee}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        ListEmptyComponent={
          <View style={styles.vueVide}>
            <Text style={styles.texteVide}>Aucun événement disponible dans ce mode.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

// Feuille de styles Flexbox
const styles = StyleSheet.create({
  conteneurPage: { flex: 1, paddingTop: 56, paddingHorizontal: 16, backgroundColor: '#F2F7FD' },
  titrePrincipal: { fontSize: 26, fontWeight: 'bold', color: '#00235C' },
  sousTitre: { fontSize: 14, color: '#4C5360', marginBottom: 16 },
  rangeeStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  blocStat: { flex: 1, backgroundColor: '#DCEBFF', padding: 10, borderRadius: 10, marginHorizontal: 2, alignItems: 'center' },
  valeurStat: { fontSize: 18, fontWeight: 'bold', color: '#00235C' },
  labelStat: { fontSize: 11, color: '#00235C', textAlign: 'center', marginTop: 2 },
  titreSection: { fontSize: 18, fontWeight: 'bold', color: '#00235C', marginBottom: 12 },
  carte: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#D8E6F8' },
  enteteCarte: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  titreCarte: { fontSize: 17, fontWeight: 'bold', color: '#00235C', flexShrink: 1 },
  infoCarte: { color: '#3D4A5C', marginTop: 3 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 6 },
  badgeComplet: { backgroundColor: '#FFE5E5' },
  badgePresqueComplet: { backgroundColor: '#FFF0D6' },
  badgeOuvert: { backgroundColor: '#D6F5E7' },
  texteBadge: { fontSize: 11, fontWeight: 'bold', color: '#00235C' },
  vueVide: { padding: 20, alignItems: 'center' },
  texteVide: { color: '#6B7280', fontSize: 15 },
});