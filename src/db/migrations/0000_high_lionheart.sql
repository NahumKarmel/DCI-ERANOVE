CREATE TYPE "public"."mode_calcul" AS ENUM('CUMUL', 'FLUX');--> statement-breakpoint
CREATE TYPE "public"."role_utilisateur" AS ENUM('CORRESPONDANT', 'DIRECTEUR_CI_GROUPE', 'LECTEUR', 'ADMINISTRATEUR');--> statement-breakpoint
CREATE TYPE "public"."type_action" AS ENUM('CONNEXION', 'DECONNEXION', 'ECHEC_CONNEXION', 'SAISIE_CREEE', 'SAISIE_MODIFIEE', 'COMMENTAIRE_PUBLIE', 'COMMENTAIRE_MODIFIE', 'COMMENTAIRE_SUPPRIME', 'PIECE_JOINTE_AJOUTEE', 'PIECE_JOINTE_SUPPRIMEE', 'PERIODE_ROUVERTE', 'PERIODE_REFERMEE', 'OBJECTIF_MODIFIE', 'AFFECTATION_MODIFIEE', 'COMPTE_CREE', 'COMPTE_MODIFIE', 'COMPTE_DESACTIVE', 'MOT_DE_PASSE_REINITIALISE', 'EXPORT_GENERE');--> statement-breakpoint
CREATE TABLE "affectation" (
	"id" serial PRIMARY KEY NOT NULL,
	"filiale_id" integer NOT NULL,
	"indicateur_id" integer NOT NULL,
	"exercice" integer NOT NULL,
	"objectif" numeric(5, 4) NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	"modifie_le" timestamp with time zone,
	CONSTRAINT "affectation_objectif_positif" CHECK ("affectation"."objectif" > 0)
);
--> statement-breakpoint
CREATE TABLE "exercice" (
	"annee" integer PRIMARY KEY NOT NULL,
	"ouvert" boolean DEFAULT true NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "filiale" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"libelle" text NOT NULL,
	"entite_juridique" text NOT NULL,
	"ordre_affichage" smallint DEFAULT 0 NOT NULL,
	"actif" boolean DEFAULT true NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "indicateur" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"libelle" text NOT NULL,
	"libelle_court" text NOT NULL,
	"objectif_defaut" numeric(5, 4) NOT NULL,
	"mode_calcul" "mode_calcul" DEFAULT 'CUMUL' NOT NULL,
	"ordre_affichage" smallint DEFAULT 0 NOT NULL,
	"actif" boolean DEFAULT true NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "indicateur_objectif_positif" CHECK ("indicateur"."objectif_defaut" > 0)
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"utilisateur_id" integer NOT NULL,
	"expire_le" timestamp with time zone NOT NULL,
	"adresse_ip" text,
	"agent_utilisateur" text,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "utilisateur" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"nom" text NOT NULL,
	"prenom" text NOT NULL,
	"mot_de_passe_hash" text NOT NULL,
	"doit_changer_mot_de_passe" boolean DEFAULT false NOT NULL,
	"role" "role_utilisateur" NOT NULL,
	"attribut_administrateur" boolean DEFAULT false NOT NULL,
	"filiale_id" integer,
	"actif" boolean DEFAULT true NOT NULL,
	"derniere_connexion_le" timestamp with time zone,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	"cree_par" integer,
	CONSTRAINT "utilisateur_rattachement_coherent" CHECK (("utilisateur"."role" = 'CORRESPONDANT' AND "utilisateur"."filiale_id" IS NOT NULL)
          OR ("utilisateur"."role" <> 'CORRESPONDANT' AND "utilisateur"."filiale_id" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "commentaire" (
	"id" serial PRIMARY KEY NOT NULL,
	"affectation_id" integer NOT NULL,
	"auteur_id" integer NOT NULL,
	"corps" text NOT NULL,
	"publie_le" timestamp with time zone DEFAULT now() NOT NULL,
	"modifie_le" timestamp with time zone,
	"supprime_le" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "piece_jointe" (
	"id" serial PRIMARY KEY NOT NULL,
	"saisie_id" integer NOT NULL,
	"nom_original" text NOT NULL,
	"cle_stockage" text NOT NULL,
	"type_mime" text NOT NULL,
	"taille_octets" integer NOT NULL,
	"televerse_par" integer NOT NULL,
	"televerse_le" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "piece_jointe_taille_max" CHECK ("piece_jointe"."taille_octets" > 0 AND "piece_jointe"."taille_octets" <= 10485760)
);
--> statement-breakpoint
CREATE TABLE "reouverture" (
	"id" serial PRIMARY KEY NOT NULL,
	"filiale_id" integer NOT NULL,
	"exercice" integer NOT NULL,
	"mois" smallint NOT NULL,
	"motif" text NOT NULL,
	"ouvert_par" integer NOT NULL,
	"ouvert_le" timestamp with time zone DEFAULT now() NOT NULL,
	"referme_par" integer,
	"referme_le" timestamp with time zone,
	CONSTRAINT "reouverture_mois_valide" CHECK ("reouverture"."mois" BETWEEN 1 AND 12),
	CONSTRAINT "reouverture_motif_non_vide" CHECK (length(btrim("reouverture"."motif")) > 0)
);
--> statement-breakpoint
CREATE TABLE "saisie" (
	"id" serial PRIMARY KEY NOT NULL,
	"affectation_id" integer NOT NULL,
	"mois" smallint NOT NULL,
	"numerateur" integer,
	"denominateur" integer,
	"commentaire_saisie" text,
	"saisi_par" integer NOT NULL,
	"saisi_le" timestamp with time zone DEFAULT now() NOT NULL,
	"modifie_par" integer,
	"modifie_le" timestamp with time zone,
	CONSTRAINT "saisie_mois_valide" CHECK ("saisie"."mois" BETWEEN 1 AND 12),
	CONSTRAINT "saisie_numerateur_positif" CHECK ("saisie"."numerateur" IS NULL OR "saisie"."numerateur" >= 0),
	CONSTRAINT "saisie_denominateur_positif" CHECK ("saisie"."denominateur" IS NULL OR "saisie"."denominateur" >= 0)
);
--> statement-breakpoint
CREATE TABLE "journal_action" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"utilisateur_id" integer,
	"action" "type_action" NOT NULL,
	"entite" text,
	"entite_id" integer,
	"details" jsonb,
	"adresse_ip" text,
	"horodatage" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "affectation" ADD CONSTRAINT "affectation_filiale_id_filiale_id_fk" FOREIGN KEY ("filiale_id") REFERENCES "public"."filiale"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affectation" ADD CONSTRAINT "affectation_indicateur_id_indicateur_id_fk" FOREIGN KEY ("indicateur_id") REFERENCES "public"."indicateur"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affectation" ADD CONSTRAINT "affectation_exercice_exercice_annee_fk" FOREIGN KEY ("exercice") REFERENCES "public"."exercice"("annee") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_utilisateur_id_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "utilisateur" ADD CONSTRAINT "utilisateur_filiale_id_filiale_id_fk" FOREIGN KEY ("filiale_id") REFERENCES "public"."filiale"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commentaire" ADD CONSTRAINT "commentaire_affectation_id_affectation_id_fk" FOREIGN KEY ("affectation_id") REFERENCES "public"."affectation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commentaire" ADD CONSTRAINT "commentaire_auteur_id_utilisateur_id_fk" FOREIGN KEY ("auteur_id") REFERENCES "public"."utilisateur"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "piece_jointe" ADD CONSTRAINT "piece_jointe_saisie_id_saisie_id_fk" FOREIGN KEY ("saisie_id") REFERENCES "public"."saisie"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "piece_jointe" ADD CONSTRAINT "piece_jointe_televerse_par_utilisateur_id_fk" FOREIGN KEY ("televerse_par") REFERENCES "public"."utilisateur"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reouverture" ADD CONSTRAINT "reouverture_filiale_id_filiale_id_fk" FOREIGN KEY ("filiale_id") REFERENCES "public"."filiale"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reouverture" ADD CONSTRAINT "reouverture_ouvert_par_utilisateur_id_fk" FOREIGN KEY ("ouvert_par") REFERENCES "public"."utilisateur"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reouverture" ADD CONSTRAINT "reouverture_referme_par_utilisateur_id_fk" FOREIGN KEY ("referme_par") REFERENCES "public"."utilisateur"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saisie" ADD CONSTRAINT "saisie_affectation_id_affectation_id_fk" FOREIGN KEY ("affectation_id") REFERENCES "public"."affectation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saisie" ADD CONSTRAINT "saisie_saisi_par_utilisateur_id_fk" FOREIGN KEY ("saisi_par") REFERENCES "public"."utilisateur"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saisie" ADD CONSTRAINT "saisie_modifie_par_utilisateur_id_fk" FOREIGN KEY ("modifie_par") REFERENCES "public"."utilisateur"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_action" ADD CONSTRAINT "journal_action_utilisateur_id_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "affectation_unique" ON "affectation" USING btree ("filiale_id","indicateur_id","exercice");--> statement-breakpoint
CREATE INDEX "affectation_exercice_idx" ON "affectation" USING btree ("exercice");--> statement-breakpoint
CREATE INDEX "affectation_filiale_idx" ON "affectation" USING btree ("filiale_id","exercice");--> statement-breakpoint
CREATE UNIQUE INDEX "filiale_code_unique" ON "filiale" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "indicateur_code_unique" ON "indicateur" USING btree ("code");--> statement-breakpoint
CREATE INDEX "session_utilisateur_idx" ON "session" USING btree ("utilisateur_id");--> statement-breakpoint
CREATE INDEX "session_expiration_idx" ON "session" USING btree ("expire_le");--> statement-breakpoint
CREATE UNIQUE INDEX "utilisateur_email_unique" ON "utilisateur" USING btree (lower("email"));--> statement-breakpoint
CREATE INDEX "utilisateur_filiale_idx" ON "utilisateur" USING btree ("filiale_id");--> statement-breakpoint
CREATE INDEX "commentaire_affectation_idx" ON "commentaire" USING btree ("affectation_id","publie_le");--> statement-breakpoint
CREATE UNIQUE INDEX "piece_jointe_cle_unique" ON "piece_jointe" USING btree ("cle_stockage");--> statement-breakpoint
CREATE INDEX "piece_jointe_saisie_idx" ON "piece_jointe" USING btree ("saisie_id");--> statement-breakpoint
CREATE INDEX "reouverture_periode_idx" ON "reouverture" USING btree ("filiale_id","exercice","mois");--> statement-breakpoint
CREATE UNIQUE INDEX "saisie_unique" ON "saisie" USING btree ("affectation_id","mois");--> statement-breakpoint
CREATE INDEX "saisie_affectation_idx" ON "saisie" USING btree ("affectation_id");--> statement-breakpoint
CREATE INDEX "journal_horodatage_idx" ON "journal_action" USING btree ("horodatage");--> statement-breakpoint
CREATE INDEX "journal_utilisateur_idx" ON "journal_action" USING btree ("utilisateur_id");--> statement-breakpoint
CREATE INDEX "journal_entite_idx" ON "journal_action" USING btree ("entite","entite_id");