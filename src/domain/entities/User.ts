export class User {
  constructor(
    public readonly id: number,
    public nom: string,
    public prenom: string,
    public email: string,
    public telephone: string,
    public profil: UserProfile,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static determineProfile(email: string): UserProfile {
    const domain = email.split('@')[1];
    return domain === 'company.com' ? UserProfile.ADMINISTRATEUR : UserProfile.UTILISATEUR;
  }

  update(nom?: string, prenom?: string, email?: string, telephone?: string): void {
    if (nom !== undefined) this.nom = nom;
    if (prenom !== undefined) this.prenom = prenom;
    if (telephone !== undefined) this.telephone = telephone;
    
    if (email !== undefined && email !== this.email) {
      this.email = email;
      this.profil = User.determineProfile(email);
    }
    
    this.updatedAt = new Date();
  }
}

export enum UserProfile {
  ADMINISTRATEUR = 'ADMINISTRATEUR',
  UTILISATEUR = 'UTILISATEUR'
}
