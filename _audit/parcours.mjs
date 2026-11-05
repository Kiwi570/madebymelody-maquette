/* Parcours propres à madebymelody : filtres de la boutique, fiche par son lien, panier (total, deux onglets,
   donnée abîmée, commande simulée), rendez-vous en étapes (validation, préremplissage), broderie. */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  for (const taille of ['390×844', '1366×768']) {
    const { ctx, page } = await contexte({ taille: T(taille) });
    try {
      /* Filtres : le compte affiché égale les cartes visibles, l'adresse garde le choix. */
      await page.goto(BASE + '/boutique', { waitUntil: 'load' });
      await attendrePret(page);
      await page.click('[data-filtre="type"] .puce[data-valeur="robe"]');
      await attendre(300);
      const f = await page.evaluate(() => ({
        visibles: [...document.querySelectorAll('.carte-piece')].filter((c) => !c.classList.contains('est-cachee')).length,
        texte: document.querySelector('[data-resultat]').textContent, url: location.search,
        types: [...new Set([...document.querySelectorAll('.carte-piece:not(.est-cachee)')].map((c) => c.dataset.type))],
      }));
      if (f.visibles !== 11 || !f.texte.includes('11') || !f.url.includes('type=robe') || f.types.join() !== 'robe') R.echec('boutique', `filtre robes : ${f.visibles} cartes, « ${f.texte} », ${f.url}`, { page: '/boutique', taille });
      await page.click('[data-filtre="face"] .puce[data-valeur="B"]');
      await attendre(300);
      const g = await page.evaluate(() => [...document.querySelectorAll('.carte-piece:not(.est-cachee)')].every((c) => c.dataset.type === 'robe' && c.dataset.face === 'B'));
      if (!g) R.echec('boutique', 'filtres combinés type et face incohérents', { page: '/boutique', taille });

      /* Fiche ouverte par son lien, Échap la ferme et rend le focus. */
      await page.goto(BASE + '/boutique?piece=javanaise', { waitUntil: 'load' });
      await attendrePret(page);
      await attendre(400);
      const ouverte = await page.evaluate(() => !document.querySelector('#fiche').hidden && document.querySelector('[data-fiche-titre]').textContent);
      if (ouverte !== 'JAVANAISE') R.echec('boutique', `la fiche ne s'ouvre pas par son lien (${ouverte})`, { page: '/boutique?piece=javanaise', taille });
      await page.keyboard.press('Escape');
      await attendre(200);
      if (!(await page.evaluate(() => document.querySelector('#fiche').hidden))) R.echec('boutique', 'Échap ne ferme pas la fiche', { page: '/boutique', taille });

      /* Panier : total vérifié par le calcul, pièce unique ajoutée une seule fois. */
      await page.evaluate(() => localStorage.removeItem('mbm-panier'));
      await page.reload({ waitUntil: 'load' }); await attendrePret(page);
      for (const id of ['javanaise', 'madly', 'bonnie']) await page.click(`.carte-piece [data-ajouter="${id}"]`);
      await attendre(200);
      const total = await page.evaluate(() => document.querySelector('[data-panier-total]').textContent);
      if (!total.startsWith('490')) R.echec('panier', `total ${total} au lieu de 490 CHF (220 + 50 + 220)`, { page: '/boutique', taille });
      const autre = await ctx.newPage();
      await autre.goto(BASE + '/boutique', { waitUntil: 'load' }); await attendrePret(autre);
      const compteAutre = await autre.evaluate(() => document.querySelector('[data-panier-compte]').textContent);
      if (compteAutre !== '3') R.echec('panier', `deuxième onglet : ${compteAutre} pièces au lieu de 3`, { page: '/boutique', taille });
      await page.click('.carte-piece [data-ajouter="madly"]');
      await attendre(400);
      const compteSync = await autre.evaluate(() => document.querySelector('[data-panier-compte]').textContent);
      if (compteSync !== '2') R.echec('panier', `onglets non synchronisés : ${compteSync} au lieu de 2`, { page: '/boutique', taille });
      await autre.close();
      await page.click('[data-panier-bouton] >> visible=true'); await attendre(200);
      await page.click('[data-commander]'); await attendre(200);
      const apres = await page.evaluate(() => ({ n: document.querySelector('[data-panier-compte]').textContent, msg: !document.querySelector('[data-panier-message]').hidden }));
      if (apres.n !== '0' || !apres.msg) R.echec('panier', 'commande simulée : panier non vidé ou message absent', { page: '/boutique', taille });
      await page.keyboard.press('Escape');
      await page.evaluate(() => localStorage.setItem('mbm-panier', '{abîmé'));
      await page.reload({ waitUntil: 'load' });
      if ((await attendrePret(page)) === 'jamais-pret') R.echec('panier', 'une donnée abîmée bloque le site', { page: '/boutique', taille });

      /* Rendez-vous : choix prérempli par l'adresse, étape bloquée tant qu'un champ requis manque. */
      await page.goto(BASE + '/sur-mesure?sujet=mariee#rendez-vous', { waitUntil: 'load' });
      await attendrePret(page);
      const pre = await page.evaluate(() => document.querySelector('[name="sujet"][value="mariee"]').checked);
      if (!pre) R.echec('rendez-vous', 'le choix « Robe de mariée » n\'est pas prérempli', { page: '/sur-mesure?sujet=mariee', taille });
      await page.click('[data-suivant]'); await attendre(400);
      await page.click('[data-suivant]'); await attendre(300);
      const bloque = await page.evaluate(() => !document.querySelector('[data-etape="2"]').hidden && !!document.querySelector('#erreur-rdv-message')?.textContent);
      if (!bloque) R.echec('rendez-vous', 'l\'étape 2 laisse passer un message vide', { page: '/sur-mesure', taille });
      await page.fill('#rdv-message', 'Une robe bohème pour juin.');
      await page.click('[data-suivant]'); await attendre(400);
      await page.fill('#rdv-prenom', 'Ana'); await page.fill('#rdv-nom', 'Test'); await page.fill('#rdv-email', 'ana@exemple.ch');
      await page.click('[data-envoyer]'); await page.click('[data-envoyer]').catch(() => {});
      await attendre(300);
      const envoi = await page.evaluate(() => ({ msg: !document.querySelector('.etapes [data-message-envoi]').hidden, off: document.querySelector('[data-envoyer]').disabled }));
      if (!envoi.msg || !envoi.off) R.echec('rendez-vous', 'pas de message simulé ou double envoi possible', { page: '/sur-mesure', taille });
    } finally { await ctx.close(); }
  }
}
