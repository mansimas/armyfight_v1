class FightsController < ApplicationController
  before_action :set_fight, only: [:show, :edit, :update, :destroy]
  skip_before_filter :authenticate_user!, :except => [:index, :new, :edit, :destroy]

  def index
    @fights = Fight.where(:user_id => current_user.id).order(updated_at: :desc).paginate(:page => params[:page], :per_page => 30)
  end

  def all_fights
    @fights = Fight.all.order(updated_at: :desc).paginate(:page => params[:page], :per_page => 30)
  end

  def show
    @fight = Fight.find_by_name(params[:id])
    targets = []
    @fight.armies.each do |a|
      a.targets.each do |t|
        targets.push([t.id, t.army_id, t.x, t.y, t.stay_time])
      end
    end
    render :json => { :status => :ok, :fight => @fight.armies.as_json, :targets => targets.as_json, :name => @fight.name } 
    
  end

  def new
    @fight = Fight.new
  end

  def play
    @fight = Fight.find_by_name(params[:id])
    if !@fight
      redirect_to root_path
    end
  end

  def watched_fight
    ActiveRecord::Base.record_timestamps = false
    begin
      @fight = Fight.find_by(name: params[:id])
      @fight.watched = @fight.watched.to_i + 1
      @fight.save
    ensure
      ActiveRecord::Base.record_timestamps = true
    end
    render :json => { :status => :ok, :fight => @fight.id }
  end

  def edit
    if (@fight.user_id != current_user.id) && (current_user.nickname != 'mansim')
      redirect_to root_path
    end
  end

  def create
    @fight = Fight.create!(:name => params[:fight_name], :user_id => current_user.id)
    render :json => { :status => :ok, :fight => @fight.name }
  end

  def update
    @fight.name = params[:fight_name]
    @fight.save!
    render :json => { :status => :ok, :fight => @fight.name }
  end

  def destroy_armies
    fight = Fight.find_by(name: params[:fight_id])
    fight.armies.destroy_all
    render :json => { :status => :ok, :message => 'destroyed' }
  end

  def destroy
    @fight.destroy
    respond_to do |format|
      format.html { redirect_to all_fights_url }
      format.json { head :no_content }
    end
  end

  private
    def set_fight
      @fight = Fight.find_by(name: params[:id])
    end

    def fight_params
      params.require(:fight).permit(:name, :user_id, :watched)
    end
end
