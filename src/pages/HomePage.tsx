import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  IonThumbnail,
  IonImg
} from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { firestore } from '../firebase';
import { Entry, toEntry } from '../models';

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

const HomePage: React.FC = () => {
  const { userId } = useAuth();
  // console.log('This user is logged in homepage', userId);
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const entriesRef = firestore.collection('users').doc(userId)
    .collection('entries');
    return entriesRef.orderBy('date','desc').limit(7)
    .onSnapshot(({ docs }) => setEntries(docs.map(toEntry)))
  }, [userId]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Homepage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {entries.map((entry) =>
            <IonItem button key={entry.id}
              routerLink={`/my/entries/view/${entry.id}`}>
                <IonThumbnail slot="end">
                  <IonImg src={entry.pictureUrl}/>
                </IonThumbnail>
              <IonLabel>
                <h2>{formatDate(entry.date)}</h2>
                <h3>{entry.title}</h3>
              </IonLabel>
            </IonItem>
          )}
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/my/entries/add">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage >
  );
};

export default HomePage;
