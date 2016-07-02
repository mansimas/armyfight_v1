class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  protect_from_forgery with: :exception

  private

  def set_locale
    I18n.locale = params[:locale] if params[:locale].present? || "en"
  end

  def default_url_options(options = {})
    {locale: I18n.locale}
  end
end
