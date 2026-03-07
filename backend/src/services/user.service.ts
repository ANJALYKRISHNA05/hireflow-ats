import { injectable, inject } from "inversify";
import { IUserRepository } from "../interfaces/repositories/user.repository.interface";
import { Messages } from "../constants/messages";
import { IUser } from "../models/user.model";

@injectable()
export class UserService {
  constructor(
    @inject("IUserRepository")
    private userRepository: IUserRepository,
  ) {}

  async getCurrentUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(Messages.USER_NOT_FOUND);
    }
    const { password, ...safeUser } = user.toObject();
    return safeUser;
  }



async updateCurrentUser(userId: string, updateData: Partial<IUser>) {
  const user = await this.userRepository.findById(userId);
  if (!user) throw new Error(Messages.USER_NOT_FOUND);

  const allowedUpdates = {
    name: updateData.name,
    profilePicUrl: updateData.profilePicUrl,
    bio: updateData.bio,
    phone: updateData.phone,
    location: updateData.location,
    resumeUrl: updateData.resumeUrl,
    companyName: updateData.companyName,
  };

  const updated = await this.userRepository.update(userId, allowedUpdates);
  if (!updated) throw new Error("Failed to update user");

  const { password, ...safeUser } = updated.toObject();
  return safeUser;
}



}
