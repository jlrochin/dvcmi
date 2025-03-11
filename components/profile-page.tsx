"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Settings, Shield, User } from "lucide-react"

export function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    role: user?.role || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulación de actualización de perfil
    setTimeout(() => {
      toast({
        title: "Perfil actualizado",
        description: "Los cambios han sido guardados correctamente.",
      })
      setIsEditing(false)
    }, 1000)
  }

  if (!user) return null

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex flex-wrap">
          <TabsTrigger value="general" className="flex-1 sm:flex-none">
            <User className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1 sm:flex-none">
            <Shield className="mr-2 h-4 w-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex-1 sm:flex-none">
            <Clock className="mr-2 h-4 w-4" />
            Actividad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 transition-transform duration-300 hover:scale-110 hover-pulse">
                  <AvatarFallback className="text-2xl">{user.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="outline" className="mt-1">
                      {user.role}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Cargo</Label>
                    <Input
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="Cargo o especialidad"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Guardar Cambios</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Nombre</h3>
                      <p className="text-base">{user.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Cargo</h3>
                      <p className="text-base">{user.role}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Usuario</h3>
                      <p className="text-base">{user.email.split("@")[0]}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Último acceso</h3>
                      <p className="text-base">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="transition-all duration-300 hover:bg-primary/10 hover-slide-right"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Editar Perfil
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
              <CardDescription>Detalles adicionales de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Fecha de registro</p>
                    <p className="text-sm text-muted-foreground">15 de enero de 2023</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Horario habitual</p>
                    <p className="text-sm text-muted-foreground">Lunes a Viernes, 8:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Seguridad de la Cuenta</CardTitle>
              <CardDescription>Administra la seguridad de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña Actual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="button-hover transition-all duration-300">Cambiar Contraseña</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Historial de Actividad</CardTitle>
              <CardDescription>Registro de tus acciones recientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Inicio de sesión", date: "Hoy, 09:15", ip: "192.168.1.1" },
                  { action: "Actualización de inventario", date: "Ayer, 14:30", ip: "192.168.1.1" },
                  { action: "Adición de medicamento", date: "15/05/2023, 10:45", ip: "192.168.1.1" },
                  { action: "Cierre de sesión", date: "14/05/2023, 18:20", ip: "192.168.1.1" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-2 transition-all duration-300 hover:bg-muted/30 hover:pl-2 rounded-md p-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.ip}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

