import { Email } from '../value-objects/Email';
import { PhoneNumber } from '../value-objects/PhoneNumber';

export class User {
  public readonly id: number;
  public nom: string;
  public prenom: string;
  private email: Email;
  private telephone: PhoneNumber;
  private profil: UserProfile;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: number,
    nom: string,
    prenom: string,
    email: string,
    telephone: string,
    createdAt?: Date
  ) {
    if (!nom || nom.trim() === '') {
      throw new Error('Name cannot be empty');
    }

    if (!prenom || prenom.trim() === '') {
      throw new Error('First name cannot be empty');
    }

    this.id = id;
    this.nom = nom.trim();
    this.prenom = prenom.trim();
    this.email = new Email(email);
    this.telephone = new PhoneNumber(telephone);
    
    const domain = this.email.getDomain();
    if (domain === 'company.com') {
      this.profil = UserProfile.ADMINISTRATEUR;
    } else {
      this.profil = UserProfile.UTILISATEUR;
    }

    if (createdAt) {
      this.createdAt = createdAt;
      this.updatedAt = createdAt;
    } else {
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  }

  getEmail(): string {
    return this.email.getValue();
  }

  getTelephone(): string {
    return this.telephone.getValue();
  }

  getProfil(): UserProfile {
    return this.profil;
  }

  changeEmail(newEmail: string): void {
    const oldEmail = this.email.getValue();
    this.email = new Email(newEmail);
    
    if (oldEmail !== newEmail) {
      const domain = this.email.getDomain();
      if (domain === 'company.com') {
        this.profil = UserProfile.ADMINISTRATEUR;
      } else {
        this.profil = UserProfile.UTILISATEUR;
      }
      this.updatedAt = new Date();
    }
  }

  changeTelephone(newTelephone: string): void {
    this.telephone = new PhoneNumber(newTelephone);
    this.updatedAt = new Date();
  }

  isAdmin(): boolean {
    if (this.profil === UserProfile.ADMINISTRATEUR) {
      return true;
    } else {
      return false;
    }
  }

  static determineProfile(email: string): UserProfile {
    const emailObj = new Email(email);
    const domain = emailObj.getDomain();
    
    if (domain === 'company.com') {
      return UserProfile.ADMINISTRATEUR;
    } else {
      return UserProfile.UTILISATEUR;
    }
  }
}

export enum UserProfile {
  ADMINISTRATEUR = 'ADMINISTRATEUR',
  UTILISATEUR = 'UTILISATEUR'
}
