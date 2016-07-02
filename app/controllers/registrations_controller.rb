class RegistrationsController < Devise::RegistrationsController
  layout 'application'

  private

  def sign_up_params
    params.require(:user).permit(:name, :surname, :role, :nickname, :email, :password, :password_confirmation)
  end

  def account_update_params
    params.require(:user).permit(:name, :surname, :role, :nickname, :email, :password, :password_confirmation, :current_password)
  end
end