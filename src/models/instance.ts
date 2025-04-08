import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('instance')
export class Instance {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column()
    name!: string;

    @Column({ type: "boolean" })
    isMain!: boolean;

    @Column({ type: "boolean" })
    isOk!: boolean;

    @Column({ type: "varchar", nullable: true }) // <- Aquí se permite que sea null
    publicIp!: string | null;

    @Column()
    region!: string;


  createdAt: any;
}