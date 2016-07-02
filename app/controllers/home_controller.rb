class HomeController < ApplicationController
  skip_before_filter :authenticate_user!, :only => [:index, :tutorial, :events]

  def index
  end

end
