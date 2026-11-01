/* Season 0 Card Library "Available Cards" helper.
   Usability of a Skill is different from Rulebook deck-construction legality.
   Uses the OSA v1.9.22 + Update5 catalog's eligible class/rank rows and actual Hero progressions;
   never infers eligibility from the S0 ID prefix alone (hybrid lineages matter).
*/
(function (root) {
  'use strict';
  const norm = value => String(value || '').trim().toLowerCase();
  function available(card, progressions, catalog) {
    if (!card || !Array.isArray(progressions) || progressions.length === 0) return false;
    if (!['Skill', 'Item', 'Event'].includes(card.family)) return false;
    const bases = new Set(progressions.map(p => norm(p.baseClass)));
    if (Array.isArray(card.requiredBaseClasses) && card.requiredBaseClasses.length &&
        !card.requiredBaseClasses.some(name => bases.has(norm(name)))) return false;
    // Neutral Event/Item cards are available unless they carry an explicit restriction.
    if (card.family !== 'Skill') return true;
    const record = catalog?.cards?.find(c => c.card_id === card.id && c.family === 'Skill');
    if (!record?.eligible_rows?.length) return false; // No verified skill access: do not guess.
    const heroesById = new Map((catalog.cards || []).filter(c => c.family === 'Hero').map(c => [c.card_id, c]));
    const ownerRule = card.ultimate?.isUltimate ?
      /^Only\s+([^ ]+)\s+can\s+use\b/i.exec(card.ultimate.owner || record.ultimate_restriction || '') : null;
    if (card.ultimate?.isUltimate && !ownerRule) return false;
    return progressions.some(progression => {
      if (ownerRule && norm(progression.name).split(/\s+/)[0] !== norm(ownerRule[1])) return false;
      return (progression.cardIds || []).some(id => {
        const hero = heroesById.get(id);
        if (!hero) return false;
        return record.eligible_rows.some(row =>
          Number(hero.rank) >= Number(row.rank) &&
          [...(hero.accessible_class_path || []), ...(hero.active_lineages || [])].some(name => norm(name) === norm(row.class_name))
        );
      });
    });
  }
  root.GL_S0_AVAILABLE_CARDS = {available};
})(window);
