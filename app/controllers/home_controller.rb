class HomeController < ApplicationController

  skip_before_filter :authenticate_user!, :only => [:index, :tutorial, :events]

  def index
  end

  def armyfight
  end

  def tutorial
  end

  def events
  end
end
