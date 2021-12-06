import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';
// import { download } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { useAuth } from '../auth';
import { firestore } from '../firebase';
import { Entry, toEntry } from '../models';
import { trash as trashIcon} from 'ionicons/icons';
interface RouteParams {
  id: string;
}
function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

const EntryPage: React.FC = () => {
  const match = useRouteMatch<RouteParams>();
  const { id } = match.params;
  const { userId } = useAuth();
  const [entry, setEntry] = useState<Entry>();
  const history = useHistory();

  useEffect(() => {
      const entryRef = firestore.collection('users').doc(userId)
        .collection('entries').doc(id);
      entryRef.get().then((doc) => { setEntry(toEntry(doc));
      });
      // entryRef.get().then((doc) => setEntry(toEntry(doc)));
      // const entry = toEntry;
        // setEntry(entry);
  }, [userId, id]);


  const handleDelete = async () => {
    const entryRef = firestore.collection('users').doc(userId)
    .collection('entries').doc(id);
    await entryRef.delete();
    history.goBack();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton/>
        </IonButtons>
          <IonTitle>
            {formatDate(entry?.date)}
          </IonTitle> 
          <IonButtons slot="end">
            <IonButton onClick={handleDelete}>
              <IonIcon icon={trashIcon} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>{entry?.title}</h2>
        <img src={entry?.pictureUrl} alt={entry?.title}/>
        <p>{entry?.description}</p>
      </IonContent>
    </IonPage>
  );
};

export default EntryPage;
