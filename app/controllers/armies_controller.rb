class ArmiesController < ApplicationController
  before_action :set_army, only: [:show, :edit, :update, :destroy]

  def index
    @armies = Army.all
  end

  def show
  end

  def new
    render :json => { :status => :ok, :message => params }
  end

  def edit
  end

  def create
    @army = Army.new
    @army.create_army(params)
    @army.save
    @army.create_targets(params)
    fight = @army.fight
    fight.touch
    render :json => { :status => :ok, :message => params }
  end

  def update
    respond_to do |format|
      if @army.update(army_params)
        format.html { redirect_to @army, notice: 'Army was successfully updated.' }
        format.json { render :show, status: :ok, location: @army }
      else
        format.html { render :edit }
        format.json { render json: @army.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @army.destroy
    respond_to do |format|
      format.html { redirect_to armies_url, notice: 'Army was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    def set_army
      @army = Army.find(params[:id])
    end

    def army_params
      params.require(:army).permit(:fight_id, :unit_name, :speed, :hp_from, :hp_to, :dmg_from, :dmg_to, :def_inf_from, :def_inf_to, :def_hors_from, :def_hors_to, :def_arch_from, :def_arch_to, :unit_type, :columns, :rows, :x_pos, :y_pos)
    end
end
