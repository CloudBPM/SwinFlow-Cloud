/**
 * @author Cao Dahai
 * @version 1.0.0 下午04:50:18
 */
package com.cloudibpm.core;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class EntityContainer<E extends WorkflowEntity> implements Serializable,
		Cloneable {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -7164007665976485553L;
	private List<E> entities = new ArrayList<E>();
	private WorkflowEntity owner;

	public EntityContainer() {
	}

	public EntityContainer(WorkflowEntity owner) {
		this.owner = owner;
	}

	@SuppressWarnings("unchecked")
	public void append(EntityContainer<E> container) {
		if (container != null) {
			for (WorkflowEntity entity : container.getAll()) {
				this.entities.add((E) entity);
			}
		}
	}

	public void append(E[] container) {
		if (container != null) {
			for (E entity : container) {
				this.entities.add(entity);
			}
		}
	}

	public EntityContainer<E> clone() {
		EntityContainer<E> container = new EntityContainer<E>(owner);
		for (E entity : this.entities) {
			container.add(entity);
		}
		return container;
	}

	public void add(E entity) {
		this.entities.add(entity);
	}

	public WorkflowEntity[] getAll() {
		WorkflowEntity[] array = new WorkflowEntity[this.entities.size()];
		for (int i = 0; i < this.entities.size(); i++) {
			array[i] = this.entities.get(i);
		}
		return array;
	}

	public boolean has() {
		return !this.entities.isEmpty();
	}

	public E get(int index) {
		return this.entities.get(index);
	}

	public void removeAll() {
		this.entities.clear();
	}

	public WorkflowEntity getOwner() {
		return owner;
	}

	public void setOwner(WorkflowEntity owner) {
		this.owner = owner;
	}

	public E get(String id) {
		for (E entity : this.entities) {
			if (entity.getId().equals(id)) {
				return entity;
			}
		}
		return null;
	}

	public void remove(String id) {
		for (Iterator<E> it = this.entities.iterator(); it.hasNext();) {
			if (it.next().getId().equals(id)) {
				it.remove();
				return;
			}
		}
	}

	public void remove(E entity) {
		for (Iterator<E> it = this.entities.iterator(); it.hasNext();) {
			if (it.next().getId().equals(entity.getId())) {
				it.remove();
				return;
			}
		}
	}

	public boolean contains(String id) {
		for (E entity : this.entities) {
			if (entity.getId().equals(id)) {
				return true;
			}
		}
		return false;
	}

	public int size() {
		return this.entities.size();
	}
}