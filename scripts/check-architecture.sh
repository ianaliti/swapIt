#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║        VÉRIFICATION DE L'ARCHITECTURE CLEAN                   ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

ERRORS=0

echo "📋 RÈGLE 1: Domain ne doit importer AUCUNE autre couche"
echo "   (Domain → rien)"
echo ""

DOMAIN_VIOLATIONS=$(grep -r "from.*adapters\|from.*application\|from.*infrastructure" src/domain --include="*.ts" 2>/dev/null | grep -v test || true)

if [ -n "$DOMAIN_VIOLATIONS" ]; then
  echo "❌ VIOLATION DÉTECTÉE dans Domain:"
  echo "$DOMAIN_VIOLATIONS"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Domain est pur (aucune dépendance externe)"
fi

echo ""
echo "───────────────────────────────────────────────────────────────"
echo ""

echo "📋 RÈGLE 2: Application ne doit importer QUE Domain"
echo "   (Application → Domain uniquement)"
echo ""

APP_VIOLATIONS=$(grep -r "from.*adapters\|from.*infrastructure" src/application --include="*.ts" 2>/dev/null | grep -v test || true)

if [ -n "$APP_VIOLATIONS" ]; then
  echo "❌ VIOLATION DÉTECTÉE dans Application:"
  echo "$APP_VIOLATIONS"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Application dépend uniquement de Domain"
fi

echo ""
echo "───────────────────────────────────────────────────────────────"
echo ""

echo "📋 RÈGLE 3: Pas d'annotations ORM dans Domain"
echo "   (ex: @Entity, @Column, etc.)"
echo ""

ORM_IN_DOMAIN=$(grep -r "@Entity\|@Column\|@Table\|@ManyToOne\|@OneToMany" src/domain --include="*.ts" 2>/dev/null || true)

if [ -n "$ORM_IN_DOMAIN" ]; then
  echo "❌ VIOLATION: Annotations ORM détectées dans Domain:"
  echo "$ORM_IN_DOMAIN"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Aucune annotation ORM dans Domain"
fi

echo ""
echo "───────────────────────────────────────────────────────────────"
echo ""

echo "📋 RÈGLE 4: Pas d'accès DB direct dans Application"
echo "   (ex: Pool, Client, Connection)"
echo ""

DB_IN_APP=$(grep -r "Pool\|Client\|Connection\|query(" src/application --include="*.ts" 2>/dev/null | grep -v "IUserRepository\|test" || true)

if [ -n "$DB_IN_APP" ]; then
  echo "❌ VIOLATION: Accès DB détecté dans Application:"
  echo "$DB_IN_APP"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Application utilise uniquement les ports (interfaces)"
fi

echo ""
echo "───────────────────────────────────────────────────────────────"
echo ""

echo "📋 RÈGLE 5: Controllers n'ont pas de logique métier"
echo "   (ex: determineProfile, validation regex complexe)"
echo ""

LOGIC_IN_CONTROLLER=$(grep -r "determineProfile\|@.*\.com\|split('@')" src/adapters/presentation/controllers --include="*.ts" 2>/dev/null || true)

if [ -n "$LOGIC_IN_CONTROLLER" ]; then
  echo "❌ VIOLATION: Logique métier dans Controller:"
  echo "$LOGIC_IN_CONTROLLER"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Controllers appellent uniquement les Use Cases"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo "✅ ✅ ✅  ARCHITECTURE CLEAN RESPECTÉE  ✅ ✅ ✅"
  echo ""
  echo "Toutes les règles architecturales sont respectées!"
  exit 0
else
  echo "❌ ❌ ❌  $ERRORS VIOLATION(S) DÉTECTÉE(S)  ❌ ❌ ❌"
  echo ""
  echo "Corrigez les violations ci-dessus."
  exit 1
fi

